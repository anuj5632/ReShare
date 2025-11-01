"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, CheckCircle } from "lucide-react"

type Task = {
  id: number
  title: string
  status: string
  date?: string | null
  time?: string | null
  location?: string | null
  ngo?: { name?: string } | null
}

export default function VolunteerMyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/volunteer/tasks', { credentials: 'same-origin' })
        const data = await res.json()
        if (!mounted) return
        setTasks(data.tasks || [])
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5" />
      case "upcoming":
        return <Clock className="w-5 h-5" />
      default:
        return null
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Tasks</h1>
        <p className="text-muted-foreground">Track your volunteer activities</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : tasks.length === 0 ? (
          <div className="text-sm text-muted-foreground">No tasks assigned yet.</div>
        ) : (
          tasks.map((task) => (
            <Card key={task.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{task.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{task.ngo?.name || ""}</p>

                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {task.date}, {task.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {task.location}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1 ${getStatusColor(task.status)}`}
                    >
                      {getStatusIcon(task.status)}
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </div>
                    {task.status === "upcoming" && (
                      <Button size="sm" variant="outline" className="mt-3 bg-transparent">
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
