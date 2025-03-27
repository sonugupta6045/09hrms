import { NextResponse } from "next/server"
import { parseResume, storeTemporaryCandidate } from "@/lib/resumeParser"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const positionId = formData.get("positionId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${uuidv4()}-${file.name}`

    // Upload file to Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(buffer, fileName)

    // Parse the resume
    const parsedData = await parseResume(buffer, file.type)

    // Store in temporary database
    const tempCandidate = await storeTemporaryCandidate(cloudinaryUrl, parsedData)

    return NextResponse.json({
      ...parsedData,
      tempId: tempCandidate.tempId,
      resumeUrl: cloudinaryUrl,
      positionId,
    })
  } catch (error) {
    console.error("Error parsing resume:", error)
    return NextResponse.json({ error: "Failed to parse resume" }, { status: 500 })
  }
}

