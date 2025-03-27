import { type NextRequest, NextResponse } from "next/server"
import { getCollection, Collections } from "@/lib/db/mongodb"
import { auth } from "@clerk/nextjs/server"
import type { Application, Candidate } from "@/lib/db/schema"
import { ObjectId } from "mongodb"

// GET applications
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get("jobId")
    const status = searchParams.get("status")

    // Build query
    const query: any = {}

    if (jobId) {
      query.jobId = jobId
    }

    if (status) {
      query.status = status
    }

    const collection = await getCollection(Collections.APPLICATIONS)
    const applications = await collection.find(query).sort({ appliedDate: -1 }).toArray()

    // Fetch candidate details for each application
    const candidateCollection = await getCollection(Collections.CANDIDATES)
    const applicationsWithCandidates = await Promise.all(
      applications.map(async (application) => {
        const candidate = await candidateCollection.findOne({ _id: new ObjectId(application.candidateId) })
        return {
          ...application,
          candidate,
        }
      }),
    )

    return NextResponse.json(applicationsWithCandidates)
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}

// POST a new application
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.jobId || !data.name || !data.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // First, create or update the candidate
    const candidateCollection = await getCollection(Collections.CANDIDATES)

    // Check if candidate already exists
    let candidate = await candidateCollection.findOne({ email: data.email })

    if (!candidate) {
      // Create new candidate
      const newCandidate: Candidate = {
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        skills: data.skills
          ? typeof data.skills === "string"
            ? data.skills.split(",").map((s: string) => s.trim())
            : data.skills
          : [],
        experience: data.experience || "",
        education: data.education || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = await candidateCollection.insertOne(newCandidate)
      candidate = { ...newCandidate, _id: result.insertedId }
    } else {
      // Update existing candidate
      const updateData = {
        name: data.name,
        phone: data.phone || candidate.phone,
        skills: data.skills
          ? typeof data.skills === "string"
            ? data.skills.split(",").map((s: string) => s.trim())
            : data.skills
          : candidate.skills,
        experience: data.experience || candidate.experience,
        updatedAt: new Date(),
      }

      await candidateCollection.updateOne({ _id: new ObjectId(candidate._id) }, { $set: updateData })

      candidate = { ...candidate, ...updateData }
    }

    // Now create the application
    const newApplication: Application = {
      jobId: data.jobId,
      candidateId: candidate._id!.toString(),
      status: "New",
      coverLetter: data.coverLetter || "",
      appliedDate: new Date(),
      updatedAt: new Date(),
      notes: "",
    }

    const applicationCollection = await getCollection(Collections.APPLICATIONS)
    const result = await applicationCollection.insertOne(newApplication)

    return NextResponse.json({
      ...newApplication,
      _id: result.insertedId,
      candidate,
    })
  } catch (error) {
    console.error("Error creating application:", error)
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 })
  }
}

