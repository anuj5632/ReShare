"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { useToast } from '@/hooks/use-toast'

type Task = {
  id: number
  title: string
  ngo?: { name: string } | string | null
  category?: string | null
  date?: string | null
  time?: string | null
  location?: string | null
  description?: string | null
  icon?: string | null
  applicationStatus?: string | null // 'pending', 'approved', 'rejected', or null
}

export default function VolunteerTasksPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/volunteer/available', { credentials: 'same-origin' })
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

  const getNgoName = (ngo: Task['ngo']): string => {
    if (!ngo) return 'Unknown NGO'
    if (typeof ngo === 'string') return ngo
    if (typeof ngo === 'object' && 'name' in ngo) return ngo.name
    return 'Unknown NGO'
  }

  const filteredTasks = tasks.filter(
    (task) =>
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getNgoName(task.ngo).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const { toast } = useToast()

  const handleApply = async (taskId: number) => {
    try {
      const res = await fetch('/api/volunteer/tasks', { 
        method: 'POST', 
        credentials: 'same-origin', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ taskId }) 
      })
      const data = await res.json()
      
      if (res.status === 401) {
        // not signed in - redirect to volunteer login
        window.location.href = '/login/volunteer'
        return
      }
      
      if (!res.ok) {
        toast({ 
          title: 'Application failed', 
          description: data.error || 'Could not submit application.',
          variant: 'destructive'
        })
        return
      }

      // Refresh tasks to get updated application status
      const refreshRes = await fetch('/api/volunteer/available', { credentials: 'same-origin' })
      if (refreshRes.ok) {
        const refreshData = await refreshRes.json()
        setTasks(refreshData.tasks || [])
      } else {
        // Fallback: update local state
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId 
              ? { ...task, applicationStatus: 'pending' }
              : task
          )
        )
      }

      toast({ 
        title: 'Application submitted', 
        description: 'Your application is pending NGO approval.' 
      })
    } catch (err) {
      console.error(err)
      toast({ 
        title: 'Application failed', 
        description: 'Could not submit application.',
        variant: 'destructive'
      })
    }
  }

  const getButtonText = (task: Task): string => {
    if (task.applicationStatus === 'pending') return 'Application Pending'
    if (task.applicationStatus === 'approved') return 'Approved ✓'
    if (task.applicationStatus === 'rejected') return 'Rejected'
    return 'Apply'
  }

  const getButtonVariant = (task: Task): "default" | "secondary" | "outline" | "destructive" => {
    if (task.applicationStatus === 'pending') return 'secondary'
    if (task.applicationStatus === 'approved') return 'default'
    if (task.applicationStatus === 'rejected') return 'destructive'
    return 'default'
  }

  const isButtonDisabled = (task: Task): boolean => {
    return task.applicationStatus !== null && task.applicationStatus !== 'rejected'
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Available Tasks</h1>
        <p className="text-muted-foreground">Find volunteer opportunities that match your interests</p>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search tasks or organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tasks Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-sm text-muted-foreground">No available tasks right now.</div>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task.id} className="hover:border-primary/50 transition">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-3xl">{task.icon || '📌'}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{task.title}</h3>
                        <p className="text-sm text-muted-foreground">{getNgoName(task.ngo)}</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">{task.description}</p>

                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {task.date}, {task.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {task.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        0/1 volunteers
                      </div>
                    </div>

                    <Badge variant="outline">{task.category || 'General'}</Badge>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button 
                      className="flex-shrink-0" 
                      variant={getButtonVariant(task)}
                      disabled={isButtonDisabled(task)}
                      onClick={() => handleApply(task.id)}
                    >
                      {getButtonText(task)}
                    </Button>
                    {task.applicationStatus === 'pending' && (
                      <Badge variant="outline" className="text-xs">Awaiting approval</Badge>
                    )}
                    {task.applicationStatus === 'approved' && (
                      <Badge className="bg-green-100 text-green-700 text-xs">You're assigned!</Badge>
                    )}
                    {task.applicationStatus === 'rejected' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleApply(task.id)}
                      >
                        Apply Again
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
