"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { JobApplicationForm } from "@/components/job-application-form"
import { ArrowLeft, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import type { JobListing } from "@/lib/db/schema"

export default function ApplyPage({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<JobListing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/jobs/${params.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch job details")
        }

        const data = await response.json()
        setJob(data)
      } catch (err) {
        console.error("Error fetching job:", err)
        setError("Failed to load job details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 py-10 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-muted/30 py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error || "Job not found"}</p>
            <Link href="/jobs">
              <Button>Back to Jobs</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Link
            href={`/jobs/${params.id}`}
            className="inline-flex items-center text-sm hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to job details
          </Link>
        </motion.div>

        <JobApplicationForm jobId={params.id} jobTitle={job.title} />
      </div>
    </div>
  )
}

