import { type NextRequest, NextResponse } from "next/server"
import { getCollection, Collections } from "@/lib/db/mongodb"
import { auth } from "@clerk/nextjs/server"
import { ObjectId } from "mongodb"

// GET a specific interview
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid interview ID" }, { status: 400 })
    }

    const collection = await getCollection(Collections.INTERVIEWS)
    const interview = await collection.findOne({ _id: new ObjectId(id) })

    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 })
    }

    // Get candidate details
    const candidateCollection = await getCollection(Collections.CANDIDATES)
    const candidate = await candidateCollection.findOne({ _id: new ObjectId(interview.candidateId) })

    // Get application details
    const applicationCollection = await getCollection(Collections.APPLICATIONS)
    const application = await applicationCollection.findOne({ _id: new ObjectId(interview.applicationId) })

    return NextResponse.json({
      ...interview,
      candidate,
      application,
    })
  } catch (error) {
    console.error("Error fetching interview:", error)
    return NextResponse.json({ error: "Failed to fetch interview" }, { status: 500 })
  }
}

// UPDATE an interview
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid interview ID" }, { status: 400 })
    }

    const data = await request.json()

    // Remove fields that shouldn't be updated
    delete data._id
    delete data.applicationId
    delete data.candidateId
    delete data.createdAt

    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    // If status is being updated to 'Completed', add the completion date
    if (data.status === "Completed") {
      updateData.completedAt = new Date()
    }

    const collection = await getCollection(Collections.INTERVIEWS)

    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 })
    }

    // If status is being updated, also update the application status
    if (data.status) {
      const interview = await collection.findOne({ _id: new ObjectId(id) })

      if (interview) {
        const applicationCollection = await getCollection(Collections.APPLICATIONS)

        let applicationStatus

        switch (data.status) {
          case "Completed":
            applicationStatus = "Interviewed"
            break
          case "Cancelled":
            applicationStatus = "Shortlisted" // Revert to previous status
            break
          default:
            applicationStatus = null
        }

        if (applicationStatus) {
          await applicationCollection.updateOne(
            { _id: new ObjectId(interview.applicationId) },
            {
              $set: {
                status: applicationStatus,
                updatedAt: new Date(),
              },
            },
          )
        }
      }
    }

    return NextResponse.json({ success: true, ...updateData })
  } catch (error) {
    console.error("Error updating interview:", error)
    return NextResponse.json({ error: "Failed to update interview" }, { status: 500 })
  }
}

