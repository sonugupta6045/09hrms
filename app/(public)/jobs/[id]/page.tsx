"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { ArrowLeft, MapPin, Clock, Building, Calendar, Briefcase, CheckCircle, Share2 } from "lucide-react"

// In a real app, this would fetch from your API
async function getJob(id: string) {
  // Mock data for now
  return {
    id: Number.parseInt(id),
    title: "Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description:
      "We're looking for a skilled Frontend Developer with experience in React and Next.js to join our team. You'll be responsible for building user interfaces, implementing new features, and ensuring the performance and reliability of our web applications.",
    requirements: [
      "3+ years of experience with React",
      "Experience with Next.js and TypeScript",
      "Strong understanding of HTML, CSS, and JavaScript",
      "Experience with responsive design and cross-browser compatibility",
      "Familiarity with RESTful APIs and GraphQL",
      "Good understanding of web performance optimization techniques",
      "Ability to write clean, maintainable code",
      "Experience with testing frameworks like Jest and React Testing Library",
    ],
    responsibilities: [
      "Develop and maintain user interfaces for our web applications",
      "Collaborate with designers, product managers, and backend developers",
      "Implement new features and improve existing ones",
      "Ensure the performance, quality, and responsiveness of applications",
      "Identify and fix bugs and performance bottlenecks",
      "Participate in code reviews and help maintain code quality",
      "Stay up-to-date with emerging trends and technologies",
    ],
    benefits: [
      "Competitive salary and equity",
      "Health, dental, and vision insurance",
      "Flexible work hours and remote work options",
      "Professional development budget",
      "Home office stipend",
      "Paid time off and parental leave",
    ],
    postedDate: "2023-10-15",
    salary: "$100,000 - $140,000",
    company: {
      name: "TechCorp Inc.",
      logo: "/placeholder.svg?height=80&width=80&text=TC",
      website: "https://techcorp.example.com",
    },
  }
}

export default function JobPage({ params }: { params: { id: string } }) {
  const job = getJob(params.id)

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const shareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: `Job Opening: ${job.title}`,
        text: `Check out this job opening for ${job.title} at ${job.company.name}`,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <div className="bg-muted/30 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          <Link href="/jobs" className="inline-flex items-center text-sm mb-6 hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all jobs
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <Card className="border-none shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                      <CardTitle className="text-3xl">{job.title}</CardTitle>
                      <CardDescription className="mt-2 text-base">
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                            <Building className="h-3 w-3" />
                            {job.department}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                            <Clock className="h-3 w-3" />
                            {job.type}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                            <Calendar className="h-3 w-3" />
                            Posted {new Date(job.postedDate).toLocaleDateString()}
                          </Badge>
                        </div>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={shareJob}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Link href={`/jobs/${job.id}/apply`}>
                        <Button size="lg">Apply Now</Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center">
                      <Briefcase className="mr-2 h-5 w-5 text-primary" />
                      Job Description
                    </h3>
                    <p className="text-muted-foreground">{job.description}</p>
                  </div>

                  <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <h3 className="text-xl font-semibold mb-3 flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                      Responsibilities
                    </h3>
                    <ul className="space-y-2">
                      {job.responsibilities.map((item, index) => (
                        <motion.li key={index} variants={fadeIn} className="flex items-start">
                          <span className="bg-primary/10 text-primary rounded-full p-1 mr-3 mt-0.5">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <span className="text-muted-foreground">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <h3 className="text-xl font-semibold mb-3 flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                      Requirements
                    </h3>
                    <ul className="space-y-2">
                      {job.requirements.map((item, index) => (
                        <motion.li key={index} variants={fadeIn} className="flex items-start">
                          <span className="bg-primary/10 text-primary rounded-full p-1 mr-3 mt-0.5">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <span className="text-muted-foreground">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <h3 className="text-xl font-semibold mb-3 flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                      Benefits
                    </h3>
                    <ul className="space-y-2">
                      {job.benefits.map((item, index) => (
                        <motion.li key={index} variants={fadeIn} className="flex items-start">
                          <span className="bg-primary/10 text-primary rounded-full p-1 mr-3 mt-0.5">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <span className="text-muted-foreground">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between items-center border-t pt-6">
                  <p className="text-sm text-muted-foreground mb-4 sm:mb-0">
                    Posted: {new Date(job.postedDate).toLocaleDateString()}
                  </p>
                  <Link href={`/jobs/${job.id}/apply`}>
                    <Button>Apply for this Position</Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          </div>

          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-none shadow-lg sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl">Job Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <p className="text-sm text-muted-foreground">Company</p>
                      <p className="font-medium">{job.company.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <p className="text-sm text-muted-foreground">Job Type</p>
                      <p className="font-medium">{job.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-muted-foreground mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-muted-foreground">Salary Range</p>
                      <p className="font-medium">{job.salary}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <p className="text-sm text-muted-foreground">Posted Date</p>
                      <p className="font-medium">{new Date(job.postedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Link href={`/jobs/${job.id}/apply`} className="w-full">
                    <Button className="w-full">Apply Now</Button>
                  </Link>
                  <Button variant="outline" className="w-full" onClick={shareJob}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Job
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

