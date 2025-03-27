"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { MapPin, Clock, Building, ArrowRight, Loader2 } from "lucide-react"
import type { JobListing } from "@/lib/db/schema"

interface JobListingsProps {
  featured?: boolean
}

export default function JobListings({ featured = false }: JobListingsProps) {
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        const url = featured ? "/api/jobs?status=Published&featured=true" : "/api/jobs?status=Published"

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error("Failed to fetch jobs")
        }

        const data = await response.json()
        setJobs(featured ? data.slice(0, 3) : data) // Limit to 3 jobs on homepage
      } catch (err) {
        console.error("Error fetching jobs:", err)
        setError("Failed to load job listings. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [featured])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg border">
        <p className="text-muted-foreground">No job listings available at the moment.</p>
      </div>
    )
  }

  return (
    <motion.div
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {jobs.map((job) => (
        <motion.div key={job._id} variants={item}>
          <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{job.title}</CardTitle>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{job.type}</Badge>
              </div>
              <CardDescription className="flex flex-wrap gap-2 mt-2">
                <span className="flex items-center text-xs">
                  <Building className="h-3 w-3 mr-1" />
                  {job.department}
                </span>
                <span className="flex items-center text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  {job.location}
                </span>
                <span className="flex items-center text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="mb-4 text-muted-foreground line-clamp-3">{job.description}</p>
              <div className="space-y-2">
                <p className="font-medium text-sm">Requirements:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {job.requirements.slice(0, 3).map((req, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {req}
                    </li>
                  ))}
                  {job.requirements.length > 3 && (
                    <li className="text-sm text-muted-foreground">And {job.requirements.length - 3} more...</li>
                  )}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <p className="text-sm text-muted-foreground">Posted: {new Date(job.createdAt).toLocaleDateString()}</p>
              <Link href={`/jobs/${job._id}/apply`}>
                <Button className="group">
                  Apply Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}

