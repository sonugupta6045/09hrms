import { type NextRequest, NextResponse } from "next/server"
import { getCollection, Collections } from "@/lib/db/mongodb"
import { auth } from "@clerk/nextjs/server"
import { ObjectId } from "mongodb"

// GET a specific application
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid application ID" }, { status: 400 })
    }

    const collection = await getCollection(Collections.APPLICATIONS)
    const application = await collection.findOne({ _id: new ObjectId(id) })

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // Get candidate details
    const candidateCollection = await getCollection(Collections.CANDIDATES)
    const candidate = await candidateCollection.findOne({ _id: new ObjectId(application.candidateId) })

    // Get job details
    const jobCollection = await getCollection(Collections.JOB_LISTINGS)
    const job = await jobCollection.findOne({ _id: new ObjectId(application.jobId) })

    return NextResponse.json({
      ...application,
      candidate,
      job,
    })
  } catch (error) {
    console.error("Error fetching application:", error)
    return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 })
  }
}

// UPDATE an application
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid application ID" }, { status: 400 })
    }

    const data = await request.json()

    // Remove fields that shouldn't be updated
    delete data._id
    delete data.jobId
    delete data.candidateId
    delete data.appliedDate

    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    const collection = await getCollection(Collections.APPLICATIONS)

    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, ...updateData })
  } catch (error) {
    console.error("Error updating application:", error)
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
  }
}

