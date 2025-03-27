import { type NextRequest, NextResponse } from "next/server"
import { getCollection, Collections } from "@/lib/db/mongodb"
import { auth } from "@clerk/nextjs/server"
import type { JobListing } from "@/lib/db/schema"

// GET all job listings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "Published"
    const featured = searchParams.get("featured") === "true"
    const department = searchParams.get("department")
    const location = searchParams.get("location")
    const type = searchParams.get("type")

    // Build query
    const query: any = {}

    // Only show published jobs to public
    if (status) {
      query.status = status
    }

    if (featured) {
      query.featured = featured
    }

    if (department) {
      query.department = department
    }

    if (location) {
      query.location = location
    }

    if (type) {
      query.type = type
    }

    const collection = await getCollection(Collections.JOB_LISTINGS)
    const jobs = await collection.find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(jobs)
  } catch (error) {
    console.error("Error fetching job listings:", error)
    return NextResponse.json({ error: "Failed to fetch job listings" }, { status: 500 })
  }
}

// POST a new job listing
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.department || !data.location || !data.type || !data.description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newJob: JobListing = {
      ...data,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: data.status || "Draft",
      featured: data.featured || false,
      requirements: Array.isArray(data.requirements) ? data.requirements : [],
      responsibilities: Array.isArray(data.responsibilities) ? data.responsibilities : [],
    }

    const collection = await getCollection(Collections.JOB_LISTINGS)
    const result = await collection.insertOne(newJob)

    return NextResponse.json({
      ...newJob,
      _id: result.insertedId,
    })
  } catch (error) {
    console.error("Error creating job listing:", error)
    return NextResponse.json({ error: "Failed to create job listing" }, { status: 500 })
  }
}

