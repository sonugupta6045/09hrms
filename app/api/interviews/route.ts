import { type NextRequest, NextResponse } from "next/server"
import { getCollection, Collections } from "@/lib/db/mongodb"
import { auth } from "@clerk/nextjs/server"
import type { Interview } from "@/lib/db/schema"
import { ObjectId } from "mongodb"

// GET interviews
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const candidateId = searchParams.get("candidateId")
    const applicationId = searchParams.get("applicationId")

    // Build query
    const query: any = {}

    if (status) {
      query.status = status
    }

    if (candidateId) {
      query.candidateId = candidateId
    }

    if (applicationId) {
      query.applicationId = applicationId
    }

    const collection = await getCollection(Collections.INTERVIEWS)
    const interviews = await collection.find(query).sort({ scheduledFor: 1 }).toArray()

    // Fetch candidate details for each interview
    const candidateCollection = await getCollection(Collections.CANDIDATES)
    const applicationCollection = await getCollection(Collections.APPLICATIONS)

    const interviewsWithDetails = await Promise.all(
      interviews.map(async (interview) => {
        const candidate = await candidateCollection.findOne({ _id: new ObjectId(interview.candidateId) })
        const application = await applicationCollection.findOne({ _id: new ObjectId(interview.applicationId) })

        return {
          ...interview,
          candidate,
          application,
        }
      }),
    )

    return NextResponse.json(interviewsWithDetails)
  } catch (error) {
    console.error("Error fetching interviews:", error)
    return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 })
  }
}

// POST a new interview
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.applicationId || !data.candidateId || !data.scheduledFor || !data.duration || !data.type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create a Google Meet link (in a real app, you would use the Google Calendar API)
    const meetingUrl =
      data.type === "Video"
        ? `https://meet.google.com/fake-meeting-${Math.random().toString(36).substring(7)}`
        : undefined

    const newInterview: Interview = {
      applicationId: data.applicationId,
      candidateId: data.candidateId,
      interviewers: data.interviewers || [userId],
      scheduledFor: new Date(data.scheduledFor),
      duration: data.duration,
      type: data.type,
      location: data.location,
      meetingUrl,
      status: "Scheduled",
      notes: data.notes || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const collection = await getCollection(Collections.INTERVIEWS)
    const result = await collection.insertOne(newInterview)

    // Update the application status
    const applicationCollection = await getCollection(Collections.APPLICATIONS)
    await applicationCollection.updateOne(
      { _id: new ObjectId(data.applicationId) },
      {
        $set: {
          status: "Interviewed",
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({
      ...newInterview,
      _id: result.insertedId,
    })
  } catch (error) {
    console.error("Error creating interview:", error)
    return NextResponse.json({ error: "Failed to create interview" }, { status: 500 })
  }
}

