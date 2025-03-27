import pdf from "pdf-parse"
import mammoth from "mammoth"
import { v4 as uuidv4 } from "uuid"
import prisma from "@/lib/prisma"

export async function parseResume(
  buffer: Buffer,
  mimeType: string,
): Promise<{
  name: string
  email: string
  phone: string
  skills: string[]
  experience: string
}> {
  let text: string

  if (mimeType === "application/pdf") {
    const pdfData = await pdf(buffer)
    text = pdfData.text
  } else if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const result = await mammoth.extractRawText({ buffer })
    text = result.value
  } else {
    throw new Error("Unsupported file type")
  }

  // Enhanced parsing logic with better regex patterns
  const name =
    text.match(/^([A-Z][a-z]+(?: [A-Z][a-z]+)+)/m)?.[1] ||
    text.match(/Name:?\s*([A-Z][a-z]+(?: [A-Z][a-z]+)+)/i)?.[1] ||
    ""

  const email =
    text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)?.[0] ||
    text.match(/Email:?\s*([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})/i)?.[1] ||
    ""

  const phone =
    text.match(/\b(?:\+?1[-.\s]?)?$$?([0-9]{3})$$?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/)?.[0] ||
    text.match(/Phone:?\s*((?:\+?1[-.\s]?)?$$?[0-9]{3}$$?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})/i)?.[1] ||
    ""

  // Extract skills - look for common skill section headers
  let skills: string[] = []
  const skillsSection = text.match(
    /(?:Skills|Technical Skills|Core Competencies|Expertise|Proficiencies):?\s*([\s\S]*?)(?:\n\n|\n[A-Z])/i,
  )?.[1]

  if (skillsSection) {
    // Try to extract comma-separated skills
    skills = skillsSection
      .split(/,|\n•|\n-|\n\*|\n/)
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0 && skill.length < 50) // Filter out empty or too long entries
  }

  // Extract experience - look for common experience section headers
  let experience = ""
  const experienceSection = text.match(
    /(?:Experience|Work Experience|Professional Experience|Employment History):?\s*([\s\S]*?)(?:\n\n\w|Education|Skills)/i,
  )?.[1]

  if (experienceSection) {
    experience = experienceSection.trim()
  }

  return { name, email, phone, skills, experience }
}

// Function to temporarily store candidate data
export async function storeTemporaryCandidate(
  resumeUrl: string,
  parsedData: {
    name: string
    email: string
    phone: string
    skills: string[]
    experience: string
  },
) {
  // Generate a temporary ID for the session
  const tempId = uuidv4()

  // Store in temporary table
  const tempCandidate = await prisma.temporaryCandidate.create({
    data: {
      tempId,
      name: parsedData.name,
      email: parsedData.email,
      phone: parsedData.phone || null,
      skills: parsedData.skills,
      experience: parsedData.experience || null,
      resumeUrl,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
    },
  })

  return tempCandidate
}

// Function to retrieve temporary candidate
export async function getTemporaryCandidate(tempId: string) {
  const tempCandidate = await prisma.temporaryCandidate.findUnique({
    where: { tempId },
  })

  return tempCandidate
}

// Function to convert temporary candidate to permanent
export async function convertToPermanentCandidate(
  tempId: string,
  updatedData: {
    name: string
    email: string
    phone?: string
    skills: string[]
    experience?: string
    positionId: string
    coverLetter?: string
  },
) {
  // Start a transaction
  return await prisma.$transaction(async (tx) => {
    // Get the temporary candidate
    const tempCandidate = await tx.temporaryCandidate.findUnique({
      where: { tempId },
    })

    if (!tempCandidate) {
      throw new Error("Temporary candidate not found")
    }

    // Create the permanent candidate
    const candidate = await tx.candidate.create({
      data: {
        name: updatedData.name,
        email: updatedData.email,
        phone: updatedData.phone || null,
        resumeUrl: tempCandidate.resumeUrl,
        skills: updatedData.skills,
        experience: updatedData.experience || null,
      },
    })

    // Create the application
    const application = await tx.application.create({
      data: {
        candidateId: candidate.id,
        positionId: updatedData.positionId,
        status: "New",
        matchScore: calculateMatchScore(updatedData.skills, updatedData.positionId),
        notes: updatedData.coverLetter,
      },
    })

    // Delete the temporary candidate
    await tx.temporaryCandidate.delete({
      where: { tempId },
    })

    return { candidate, application }
  })
}

// Helper function to calculate match score
async function calculateMatchScore(candidateSkills: string[], positionId: string): Promise<number> {
  try {
    // Get the position requirements
    const position = await prisma.position.findUnique({
      where: { id: positionId },
      select: { requirements: true },
    })

    if (!position) return 70 // Default score

    // Simple matching algorithm - count how many skills appear in requirements
    const requirements = position.requirements.toLowerCase()
    let matchCount = 0

    for (const skill of candidateSkills) {
      if (requirements.includes(skill.toLowerCase())) {
        matchCount++
      }
    }

    // Calculate score (base 70 + up to 30 points for matches)
    const baseScore = 70
    const matchScore = Math.min(30, Math.floor((matchCount / candidateSkills.length) * 30))

    return baseScore + matchScore
  } catch (error) {
    console.error("Error calculating match score:", error)
    return 70 // Default score on error
  }
}

