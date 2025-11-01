"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"

type ProfileData = {
  name: string
  email: string
  phone: string
  skills: string[]
  availability: string
  hoursVolunteered: number
  tasksCompleted: number
  badgesEarned: number
}

export default function VolunteerProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/volunteer/profile', { credentials: 'same-origin' })
        if (!res.ok) {
          if (mounted) setLoading(false)
          return
        }
        const data = await res.json()
        if (!mounted) return
        setProfile(data.profile)
      } catch (err) {
        console.error('Failed to fetch profile:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  if (loading) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Loading your volunteer information...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Failed to load profile data. Please try again.</p>
        </div>
      </div>
    )
  }

  // Determine which badges are earned
  const badges = [
    { name: "First Task", icon: "🎯", earned: profile.tasksCompleted >= 1 },
    { name: "Community Helper", icon: "🤝", earned: profile.tasksCompleted >= 5 },
    { name: "10 Tasks", icon: "✓✓", earned: profile.tasksCompleted >= 10 },
    { name: "50 Hours", icon: "⏱️", earned: profile.hoursVolunteered >= 50 },
    { name: "Top Volunteer", icon: "⭐", earned: profile.tasksCompleted >= 25 },
  ]

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">Your volunteer information and achievements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Hours Volunteered</p>
            <p className="text-3xl font-bold mt-2">{loading ? "0" : profile.hoursVolunteered}h</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Tasks Completed</p>
            <p className="text-3xl font-bold mt-2">{loading ? "0" : profile.tasksCompleted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Badges Earned</p>
            <p className="text-3xl font-bold mt-2">{loading ? "0" : profile.badgesEarned}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Name</p>
            <p className="font-semibold">{profile.name || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Email</p>
            <p className="font-semibold">{profile.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Phone</p>
            <p className="font-semibold">{profile.phone || 'Not provided'}</p>
          </div>
          {profile.availability && (
            <div>
              <p className="text-xs text-muted-foreground font-medium">Availability</p>
              <p className="font-semibold">{profile.availability}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-2">
              {profile.skills.length > 0 ? 'Your Registered Skills' : 'No skills registered yet'}
            </p>
            {profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill} className="bg-primary/10 text-primary">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">You haven't added any skills during registration.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {badges.map((achievement) => (
              <div 
                key={achievement.name} 
                className={`text-center p-4 rounded-lg border transition-opacity ${
                  achievement.earned 
                    ? 'bg-primary/5 border-primary/20' 
                    : 'bg-muted/30 border-border opacity-50'
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <p className="text-xs font-medium">{achievement.name}</p>
                {achievement.earned ? (
                  <CheckCircle className="w-4 h-4 text-accent mx-auto mt-2" />
                ) : (
                  <div className="w-4 h-4 mx-auto mt-2 opacity-30" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
