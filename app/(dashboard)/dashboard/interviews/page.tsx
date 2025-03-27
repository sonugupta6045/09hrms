import type { Metadata } from "next"
import { Suspense } from "react"
import { InterviewsList } from "@/components/dashboard/interviews-list"
import { InterviewScheduler } from "@/components/dashboard/interview-scheduler"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Interviews | HRMS",
  description: "Schedule and manage candidate interviews",
}

export default function InterviewsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Interviews</h1>
        <p className="text-muted-foreground">Schedule and manage candidate interviews.</p>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Interviews</TabsTrigger>
          <TabsTrigger value="schedule">Schedule Interview</TabsTrigger>
          <TabsTrigger value="past">Past Interviews</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-4">
          <Suspense fallback={<InterviewsListSkeleton />}>
            <InterviewsList type="upcoming" />
          </Suspense>
        </TabsContent>
        <TabsContent value="schedule" className="mt-4">
          <InterviewScheduler />
        </TabsContent>
        <TabsContent value="past" className="mt-4">
          <Suspense fallback={<InterviewsListSkeleton />}>
            <InterviewsList type="past" />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function InterviewsListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>
      <div className="rounded-lg border">
        <div className="border-b px-4 py-3">
          <Skeleton className="h-6 w-full max-w-[300px]" />
        </div>
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
      </div>
    </div>
  )
}

