import { NextResponse } from "next/server"
import { getTemporaryCandidate } from "@/lib/resumeParser"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tempId = searchParams.get("tempId")

    if (!tempId) {
      return NextResponse.json({ error: "No temporary ID provided" }, { status: 400 })
    }

    const tempCandidate = await getTemporaryCandidate(tempId)

    if (!tempCandidate) {
      return NextResponse.json({ error: "Temporary candidate not found" }, { status: 404 })
    }

    return NextResponse.json(tempCandidate)
  } catch (error) {
    console.error("Error fetching temporary candidate:", error)
    return NextResponse.json({ error: "Failed to fetch temporary candidate" }, { status: 500 })
  }
}

