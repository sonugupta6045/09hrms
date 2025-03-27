"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon, Check, ChevronsUpDown, Clock, Plus, User, Video } from "lucide-react"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

// Mock data for candidates
const mockCandidates = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    position: "Frontend Developer",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Samantha Lee",
    email: "samantha.lee@example.com",
    position: "UX Designer",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    position: "Backend Developer",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    position: "Product Manager",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

// Mock data for interviewers
const mockInterviewers = [
  {
    id: "1",
    name: "Jane Smith",
    email: "jane.smith@company.com",
    department: "Engineering",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Mike Brown",
    email: "mike.brown@company.com",
    department: "Engineering",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    department: "Design",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david.wilson@company.com",
    department: "Product",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function InterviewScheduler() {
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState("")
  const [duration, setDuration] = useState("60")
  const [interviewType, setInterviewType] = useState("video")
  const [location, setLocation] = useState("")
  const [candidateOpen, setCandidateOpen] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState("")
  const [interviewerOpen, setInterviewerOpen] = useState(false)
  const [selectedInterviewers, setSelectedInterviewers] = useState<string[]>([])
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Show success message
    setIsSuccess(true)
    setIsSubmitting(false)

    // Reset form after 2 seconds
    setTimeout(() => {
      setDate(undefined)
      setTime("")
      setDuration("60")
      setInterviewType("video")
      setLocation("")
      setSelectedCandidate("")
      setSelectedInterviewers([])
      setNotes("")
      setIsSuccess(false)
    }, 2000)
  }

  const selectedCandidateData = mockCandidates.find((c) => c.id === selectedCandidate)

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Schedule New Interview</CardTitle>
          <CardDescription>Set up an interview with a candidate and team members.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="candidate">Select Candidate</Label>
              <Popover open={candidateOpen} onOpenChange={setCandidateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={candidateOpen}
                    className="w-full justify-between"
                  >
                    {selectedCandidate
                      ? mockCandidates.find((candidate) => candidate.id === selectedCandidate)?.name
                      : "Select candidate..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search candidates..." />
                    <CommandList>
                      <CommandEmpty>No candidate found.</CommandEmpty>
                      <CommandGroup>
                        {mockCandidates.map((candidate) => (
                          <CommandItem
                            key={candidate.id}
                            value={candidate.id}
                            onSelect={(currentValue) => {
                              setSelectedCandidate(currentValue === selectedCandidate ? "" : currentValue)
                              setCandidateOpen(false)
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={candidate.avatar} alt={candidate.name} />
                                <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="text-sm">
                                <p>{candidate.name}</p>
                                <p className="text-xs text-muted-foreground">{candidate.position}</p>
                              </div>
                            </div>
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedCandidate === candidate.id ? "opacity-100" : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {selectedCandidateData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3 rounded-md bg-muted"
              >
                <Avatar>
                  <AvatarImage src={selectedCandidateData.avatar} alt={selectedCandidateData.name} />
                  <AvatarFallback>{selectedCandidateData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedCandidateData.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedCandidateData.position}</p>
                </div>
              </motion.div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Interview Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Interview Time</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="09:30">9:30 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="10:30">10:30 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="11:30">11:30 AM</SelectItem>
                  <SelectItem value="13:00">1:00 PM</SelectItem>
                  <SelectItem value="13:30">1:30 PM</SelectItem>
                  <SelectItem value="14:00">2:00 PM</SelectItem>
                  <SelectItem value="14:30">2:30 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM</SelectItem>
                  <SelectItem value="15:30">3:30 PM</SelectItem>
                  <SelectItem value="16:00">4:00 PM</SelectItem>
                  <SelectItem value="16:30">4:30 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Interview Type</Label>
              <RadioGroup value={interviewType} onValueChange={setInterviewType} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="video" />
                  <Label htmlFor="video" className="flex items-center gap-1 cursor-pointer">
                    <Video className="h-4 w-4" /> Video
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="in-person" id="in-person" />
                  <Label htmlFor="in-person" className="flex items-center gap-1 cursor-pointer">
                    <User className="h-4 w-4" /> In-person
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {interviewType === "in-person" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter meeting location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </motion.div>
          )}

          <div className="space-y-2">
            <Label htmlFor="interviewers">Select Interviewers</Label>
            <Popover open={interviewerOpen} onOpenChange={setInterviewerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={interviewerOpen}
                  className="w-full justify-between"
                >
                  {selectedInterviewers.length > 0
                    ? `${selectedInterviewers.length} interviewer${selectedInterviewers.length > 1 ? "s" : ""} selected`
                    : "Select interviewers..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search interviewers..." />
                  <CommandList>
                    <CommandEmpty>No interviewer found.</CommandEmpty>
                    <CommandGroup>
                      {mockInterviewers.map((interviewer) => (
                        <CommandItem
                          key={interviewer.id}
                          value={interviewer.id}
                          onSelect={() => {
                            setSelectedInterviewers((prev) => {
                              if (prev.includes(interviewer.id)) {
                                return prev.filter((id) => id !== interviewer.id)
                              } else {
                                return [...prev, interviewer.id]
                              }
                            })
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={interviewer.avatar} alt={interviewer.name} />
                              <AvatarFallback>{interviewer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                              <p>{interviewer.name}</p>
                              <p className="text-xs text-muted-foreground">{interviewer.department}</p>
                            </div>
                          </div>
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              selectedInterviewers.includes(interviewer.id) ? "opacity-100" : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {selectedInterviewers.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2">
              {selectedInterviewers.map((id) => {
                const interviewer = mockInterviewers.find((i) => i.id === id)
                if (!interviewer) return null

                return (
                  <div key={id} className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full text-sm">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={interviewer.avatar} alt={interviewer.name} />
                      <AvatarFallback>{interviewer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{interviewer.name}</span>
                  </div>
                )
              })}
            </motion.div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Interview Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes or instructions for the interview..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!selectedCandidate || !date || !time || selectedInterviewers.length === 0 || isSubmitting}
            className={cn(isSuccess && "bg-green-600 hover:bg-green-700")}
          >
            {isSubmitting ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Scheduling...
              </>
            ) : isSuccess ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Scheduled!
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Interview
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

