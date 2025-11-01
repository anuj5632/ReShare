"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"
import { Users, MapPin, Clock, Award, ArrowRight, Zap, Calendar } from "lucide-react"
import { useEffect, useState } from "react"

type Task = {
  id: number
  title: string
  ngo?: { name: string } | string | null
  date?: string | null
  time?: string | null
  location?: string | null
  icon?: string | null
  status?: string | null
  createdAt?: string | null
}

export default function VolunteerDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<{ label: string; value: string; icon: any; color: string }[]>([
    { label: 'Tasks Completed', value: '0', icon: Users, color: 'text-blue-600' },
    { label: 'Hours Volunteered', value: '0', icon: Clock, color: 'text-green-600' },
    { label: 'Impact Points', value: '0', icon: Zap, color: 'text-amber-600' },
    { label: 'Badges Earned', value: '0', icon: Award, color: 'text-purple-600' },
  ])
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const getNgoName = (ngo: Task['ngo']): string => {
    if (!ngo) return 'Unknown NGO'
    if (typeof ngo === 'string') return ngo
    if (typeof ngo === 'object' && 'name' in ngo) return ngo.name
    return 'Unknown NGO'
  }

  const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return 'Date TBD'
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    } catch {
      return dateStr
    }
  }

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task)
    setIsDialogOpen(true)
  }

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        // fetch profile/stats
        const meRes = await fetch('/api/auth/me', { credentials: 'same-origin' })
        const meData = await meRes.json()

        // fetch available tasks
        const tasksRes = await fetch('/api/volunteer/available', { credentials: 'same-origin' })
        const tasksData = await tasksRes.json()

        if (!mounted) return

        const completed = meData?.user?.roleData?.completedTasks ?? 0
        setStats([
          { label: 'Tasks Completed', value: String(completed), icon: Users, color: 'text-blue-600' },
          { label: 'Hours Volunteered', value: '0', icon: Clock, color: 'text-green-600' },
          { label: 'Impact Points', value: '0', icon: Zap, color: 'text-amber-600' },
          { label: 'Badges Earned', value: '0', icon: Award, color: 'text-purple-600' },
        ])

        setUpcomingTasks(tasksData.tasks || [])
      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, Volunteer!</h1>
          <p className="text-muted-foreground">Here's your volunteering overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{loading ? "0" : stat.value}</p>
                  </div>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Volunteer opportunities near you</CardDescription>
          </div>
          <Link href="/volunteer/tasks">
            <Button variant="outline">Find More</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition flex items-start justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{task.icon || '📌'}</span>
                    <div>
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{getNgoName(task.ngo)}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{task.date}</span>
                        <span>{task.time}</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {task.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => handleViewDetails(task)}
                  variant="outline"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Task Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedTask && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-3">
                  <span className="text-4xl">{selectedTask.icon || '📌'}</span>
                  <div className="flex-1">
                    <DialogTitle className="text-2xl">{selectedTask.title}</DialogTitle>
                    <DialogDescription className="text-base mt-1">
                      Organized by {getNgoName(selectedTask.ngo)}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Date & Time Section */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Schedule
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{formatDate(selectedTask.date)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {selectedTask.time || 'Time TBD'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location Section */}
                {selectedTask.location && (
                  <div className="space-y-2 pl-7">
                    <h3 className="font-semibold flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Location
                    </h3>
                    <p className="text-muted-foreground">{selectedTask.location}</p>
                  </div>
                )}

                {/* Task Status */}
                {selectedTask.status && (
                  <div className="space-y-2 pl-7">
                    <h3 className="font-semibold">Status</h3>
                    <p className="text-muted-foreground capitalize">{selectedTask.status}</p>
                  </div>
                )}

                {/* Additional Info */}
                {selectedTask.createdAt && (
                  <div className="space-y-2 pl-7 pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Posted: {new Date(selectedTask.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                <Link href="/volunteer/tasks">
                  <Button>
                    View All Tasks
                  </Button>
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Browse All Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Find volunteer opportunities that match your interests.
            </p>
            <Link href="/volunteer/tasks">
              <Button variant="outline">View All Tasks</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg">My Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Track tasks you've signed up for.</p>
            <Link href="/volunteer/my-tasks">
              <Button variant="outline">View My Tasks</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
