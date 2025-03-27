"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, Clock, Download, MoreHorizontal, Search, User, Video } from "lucide-react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

// Mock data for interviews
const mockInterviews = [
  {
    id: "1",
    candidateName: "Alex Johnson",
    candidateEmail: "alex.johnson@example.com",
    position: "Frontend Developer",
    date: "2023-06-15T14:00:00",
    duration: 60,
    status: "Scheduled",
    type: "Video",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    interviewers: ["Jane Smith", "Mike Brown"],
    notes: "Focus on React experience and system design",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    candidateName: "Samantha Lee",
    candidateEmail: "samantha.lee@example.com",
    position: "UX Designer",
    date: "2023-06-16T11:30:00",
    duration: 45,
    status: "Scheduled",
    type: "In-person",
    location: "Conference Room 3",
    interviewers: ["David Wilson", "Emily Chen"],
    notes: "Portfolio review and design challenge discussion",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    candidateName: "Michael Chen",
    candidateEmail: "michael.chen@example.com",
    position: "Backend Developer",
    date: "2023-06-10T15:00:00",
    duration: 60,
    status: "Completed",
    type: "Video",
    meetingLink: "https://meet.google.com/xyz-abcd-efg",
    interviewers: ["Sarah Johnson", "Robert Lee"],
    notes: "Strong in Node.js and database design",
    feedback: "Excellent technical skills, good cultural fit",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    candidateName: "Emily Rodriguez",
    candidateEmail: "emily.rodriguez@example.com",
    position: "Product Manager",
    date: "2023-06-09T10:00:00",
    duration: 90,
    status: "Cancelled",
    type: "Video",
    meetingLink: "https://meet.google.com/lmn-opqr-stu",
    interviewers: ["John Davis", "Lisa Wang"],
    notes: "Candidate requested reschedule",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

type Interview = (typeof mockInterviews)[0]

interface InterviewsListProps {
  type: "upcoming" | "past"
}

export function InterviewsList({ type }: InterviewsListProps) {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Simulate API call
    const fetchInterviews = async () => {
      setLoading(true)
      // In a real app, you would fetch from your API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const now = new Date()
      const filteredInterviews = mockInterviews.filter((interview) => {
        const interviewDate = new Date(interview.date)
        return type === "upcoming"
          ? interviewDate > now && interview.status !== "Cancelled"
          : interviewDate < now || interview.status === "Cancelled" || interview.status === "Completed"
      })

      setInterviews(filteredInterviews)
      setLoading(false)
    }

    fetchInterviews()
  }, [type])

  const filteredInterviews = interviews.filter((interview) => {
    const matchesSearch =
      interview.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.interviewers.some((interviewer) => interviewer.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "Completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string, duration: number) => {
    const date = new Date(dateString)
    const startTime = date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })

    const endDate = new Date(date.getTime() + duration * 60000)
    const endTime = endDate.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })

    return `${startTime} - ${endTime}`
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
        <Card>
          <CardHeader className="py-4">
            <Skeleton className="h-6 w-[200px]" />
          </CardHeader>
          <CardContent className="p-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 border-b last:border-0">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <Skeleton className="h-5 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                    <Skeleton className="h-8 w-[100px]" />
                  </div>
                  <div className="flex gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-4 w-[120px]" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search interviews..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" className="h-9 w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" />
          Export Calendar
        </Button>
      </div>

      <Card>
        <CardHeader className="py-4">
          <CardTitle>
            {type === "upcoming" ? "Upcoming Interviews" : "Past Interviews"} ({filteredInterviews.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredInterviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No {type} interviews found.</div>
          ) : (
            <div className="divide-y">
              {filteredInterviews.map((interview) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="font-medium">{interview.position} Interview</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{formatDate(interview.date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{formatTime(interview.date, interview.duration)}</span>
                          </div>
                          {interview.type === "Video" ? (
                            <div className="flex items-center gap-1">
                              <Video className="h-3.5 w-3.5" />
                              <span>Video Call</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5" />
                              <span>In-person</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline" className={getStatusColor(interview.status)}>
                        {interview.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={interview.avatar} alt={interview.candidateName} />
                        <AvatarFallback>{interview.candidateName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{interview.candidateName}</p>
                        <p className="text-sm text-muted-foreground">{interview.candidateEmail}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="text-muted-foreground">Interviewers:</span>
                      {interview.interviewers.map((interviewer, index) => (
                        <span key={index} className="font-medium">
                          {interviewer}
                          {index < interview.interviewers.length - 1 ? "," : ""}
                        </span>
                      ))}
                    </div>

                    {interview.notes && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Notes:</span> {interview.notes}
                      </p>
                    )}

                    {interview.feedback && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Feedback:</span> {interview.feedback}
                      </p>
                    )}

                    <div className="flex justify-end gap-2 mt-2">
                      {interview.status === "Scheduled" && (
                        <>
                          {interview.type === "Video" && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer">
                                <Video className="mr-2 h-4 w-4" />
                                Join Meeting
                              </a>
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Link href={`/dashboard/interviews/${interview.id}`} className="w-full">
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>Reschedule</DropdownMenuItem>
                              <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Cancel Interview</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      )}

                      {interview.status === "Completed" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Link href={`/dashboard/interviews/${interview.id}`} className="w-full">
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Add Feedback</DropdownMenuItem>
                            <DropdownMenuItem>Schedule Follow-up</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

