"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Edit2, Save, Clock } from "lucide-react"

type ProfileData = {
  name: string
  email: string
  verified: boolean
}

type StatsData = {
  totalClaims: number
  itemsReceived: number
  peopleServed: number
}

export default function NGOProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    verified: false,
  })
  const [stats, setStats] = useState<StatsData>({
    totalClaims: 0,
    itemsReceived: 0,
    peopleServed: 0,
  })

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/ngo/profile', { credentials: 'same-origin' })
        if (!res.ok) {
          if (mounted) setLoading(false)
          return
        }
        const data = await res.json()
        if (!mounted) return
        setProfile(data.profile || { name: "", email: "", verified: false })
        setStats(data.stats || { totalClaims: 0, itemsReceived: 0, peopleServed: 0 })
      } catch (err) {
        console.error('Failed to fetch profile:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      // In future, add API endpoint to update profile
      setIsEditing(false)
    } catch (err) {
      console.error('Failed to save profile:', err)
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Organization Profile</h1>
          <p className="text-muted-foreground">Manage your NGO information</p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "default" : "outline"}
          className="bg-transparent"
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>Your verified NGO information</CardDescription>
            </div>
            {!loading && profile.verified && (
              <Badge className="bg-green-100 text-green-800 border-green-300">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
            {!loading && !profile.verified && (
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                <Clock className="w-3 h-3 mr-1" />
                Pending Verification
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isEditing ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Organization Name</label>
                  <Input name="name" value={profile.name} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input type="email" name="email" value={profile.email} onChange={handleChange} />
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button onClick={handleSave}>Save Changes</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="bg-transparent">
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Organization Name</p>
                  <p className="font-semibold mt-1">{loading ? "Loading..." : profile.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Email</p>
                  <p className="font-semibold mt-1">{loading ? "Loading..." : profile.email || "N/A"}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Claims Made</p>
            <p className="text-3xl font-bold mt-2">{loading ? "0" : stats.totalClaims}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Items Received</p>
            <p className="text-3xl font-bold mt-2">{loading ? "0" : stats.itemsReceived}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">People Served</p>
            <p className="text-3xl font-bold mt-2">{loading ? "0" : stats.peopleServed}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
