// MongoDB Schema Types

// User (HR Staff) Schema
export interface User {
  _id?: string
  name: string
  email: string
  role: "admin" | "hr" | "interviewer"
  department?: string
  title?: string
  phone?: string
  avatar?: string
  clerkId: string
  createdAt: Date
  updatedAt: Date
}

// Job Listing Schema
export interface JobListing {
  _id?: string
  title: string
  department: string
  location: string
  type: "Full-time" | "Part-time" | "Contract" | "Internship" | "Remote"
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits?: string[]
  salary?: {
    min?: number
    max?: number
    currency?: string
    isVisible: boolean
  }
  status: "Draft" | "Published" | "Closed"
  createdBy: string // Reference to User
  createdAt: Date
  updatedAt: Date
  closingDate?: Date
  featured: boolean
}

// Candidate Schema
export interface Candidate {
  _id?: string
  name: string
  email: string
  phone?: string
  skills: string[]
  experience?: string
  education?: {
    degree: string
    institution: string
    year: number
  }[]
  createdAt: Date
  updatedAt: Date
}

// Application Schema
export interface Application {
  _id?: string
  jobId: string // Reference to JobListing
  candidateId: string // Reference to Candidate
  status: "New" | "Reviewed" | "Shortlisted" | "Interviewed" | "Offered" | "Hired" | "Rejected"
  coverLetter?: string
  appliedDate: Date
  updatedAt: Date
  notes?: string
  rating?: number // 1-5 rating
}

// Interview Schema
export interface Interview {
  _id?: string
  applicationId: string // Reference to Application
  candidateId: string // Reference to Candidate
  interviewers: string[] // Array of User IDs
  scheduledFor: Date
  duration: number // in minutes
  type: "Video" | "In-person" | "Phone"
  location?: string
  meetingUrl?: string
  status: "Scheduled" | "Completed" | "Cancelled" | "No-show"
  feedback?: {
    userId: string // Reference to User
    rating: number // 1-5 rating
    comments: string
    strengths?: string[]
    weaknesses?: string[]
    createdAt: Date
  }[]
  notes?: string
  createdAt: Date
  updatedAt: Date
}

