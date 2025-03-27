import { type NextRequest, NextResponse } from "next/server"
import { getCollection, Collections } from "@/lib/db/mongodb"
import { auth } from "@clerk/nextjs/server"
import { ObjectId } from "mongodb"

// GET a specific job listing
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 })
    }

    const collection = await getCollection(Collections.JOB_LISTINGS)
    const job = await collection.findOne({ _id: new ObjectId(id) })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json(job)
  } catch (error) {
    console.error("Error fetching job:", error)
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 })
  }
}

// UPDATE a job listing
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 })
    }

    const data = await request.json()

    // Remove fields that shouldn't be updated
    delete data._id
    delete data.createdBy
    delete data.createdAt

    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    const collection = await getCollection(Collections.JOB_LISTINGS)

    // First check if the job exists and if the user is authorized to update it
    const existingJob = await collection.findOne({ _id: new ObjectId(id) })

    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // In a real app, you might want to check if the user is the creator or has admin rights
    // if (existingJob.createdBy !== userId) {
    //   return NextResponse.json({ error: 'Not authorized to update this job' }, { status: 403 });
    // }

    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, ...updateData })
  } catch (error) {
    console.error("Error updating job:", error)
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 })
  }
}

// DELETE a job listing
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 })
    }

    const collection = await getCollection(Collections.JOB_LISTINGS)

    // First check if the job exists and if the user is authorized to delete it
    const existingJob = await collection.findOne({ _id: new ObjectId(id) })

    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // In a real app, you might want to check if the user is the creator or has admin rights
    // if (existingJob.createdBy !== userId) {
    //   return NextResponse.json({ error: 'Not authorized to delete this job' }, { status: 403 });
    // }

    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting job:", error)
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 })
  }
}

