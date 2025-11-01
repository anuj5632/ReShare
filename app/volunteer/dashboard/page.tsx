"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, MapPin, Clock, Award, ArrowRight, Zap } from "lucide-react"
import { useEffect, useState } from "react"

export default function VolunteerDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<{ label: string; value: string; icon: any; color: string }[]>([
    { label: 'Tasks Completed', value: '0', icon: Users, color: 'text-blue-600' },
    { label: 'Hours Volunteered', value: '0', icon: Clock, color: 'text-green-600' },
    { label: 'Impact Points', value: '0', icon: Zap, color: 'text-amber-600' },
    { label: 'Badges Earned', value: '0', icon: Award, color: 'text-purple-600' },
  ])
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([])

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
                      <p className="text-sm text-muted-foreground mt-1">{task.ngo}</p>
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
                <Link href={`/volunteer/tasks/${task.id}`}>
                  <Button size="sm">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
