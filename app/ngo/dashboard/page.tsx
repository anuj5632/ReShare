"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package, Users, TrendingUp, Clock, MapPin } from "lucide-react"
import { useEffect, useState } from "react"
import { useToast } from '@/hooks/use-toast'
import { useRef } from 'react'

type App = {
  id: number
  volunteer: any
  task: any
  status: string
  createdAt: string
}

export default function NGODashboard() {
  const [applications, setApplications] = useState<App[]>([])
  const [donations, setDonations] = useState<any[]>([])
  const { toast } = useToast()
  const lastCount = useRef<number>(0)

  // simple polling so NGO dashboard sees new donations shortly after donors post them
  useEffect(() => {
    let mounted = true
    let timer: any = null
    const fetchDonations = async () => {
      try {
        const res = await fetch('/api/ngo/donations', { credentials: 'same-origin' })
        if (!res.ok) return
        const data = await res.json()
        if (!mounted) return
        const list = data.donations || []
        // notify when new donations arrive
        if (lastCount.current != null && list.length > lastCount.current) {
          toast({ title: 'New donation', description: `${list.length - lastCount.current} new donation(s) received` })
        }
        lastCount.current = list.length
        setDonations(list)
      } catch (err) {
        console.error(err)
      }
    }

    fetchDonations()
    timer = setInterval(fetchDonations, 10000) // poll every 10s
    return () => { mounted = false; if (timer) clearInterval(timer) }
  }, [])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
  const res = await fetch('/api/ngo/portal', { credentials: 'same-origin' })
        const data = await res.json()
        if (!mounted) return
        setApplications(data.applications || [])
      } catch (err) {
        console.error(err)
      }
    })()
    return () => { mounted = false }
  }, [])

  const handleDecision = async (id: number, action: 'approve' | 'reject') => {
    try {
  const res = await fetch('/api/ngo/portal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ applicationId: id, action }) })
      const data = await res.json()
      if (!res.ok) return toast({ title: 'Error', description: data.error || 'Could not update application' })
      toast({ title: 'Success', description: `Application ${action}d` })
      setApplications((s) => s.map((a) => a.id === id ? { ...a, status: action === 'approve' ? 'approved' : 'rejected' } : a))
      // re-fetch donations and applications to reflect changes
      ;(async () => {
        try { await fetch('/api/ngo/portal', { credentials: 'same-origin' }) } catch {}
        try { await fetch('/api/ngo/donations', { credentials: 'same-origin' }) } catch {}
      })()
    } catch (err) {
      console.error(err)
      toast({ title: 'Error', description: 'Could not update application' })
    }
  }

  const [stats, setStats] = useState([
    { label: "Total Claims", value: "0", icon: Package, color: "text-blue-600" },
    { label: "Items Received", value: "0", icon: TrendingUp, color: "text-green-600" },
    { label: "People Served", value: "0", icon: Users, color: "text-purple-600" },
    { label: "Pending Verification", value: "Pending", icon: Clock, color: "text-amber-600" },
  ])
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        // Fetch NGO stats
        const res = await fetch('/api/ngo/portal', { credentials: 'same-origin' })
        if (!res.ok) return
        const data = await res.json()
        if (!mounted) return
        
        const claimedDonations = donations.filter(d => d.ngoId && d.status !== 'pending')
        const totalItems = donations.filter(d => d.ngoId).reduce((sum, d) => sum + (d.items || 0), 0)
        const peopleServed = Math.floor(totalItems * 2) // estimate
        
        // Check verification status
        const verified = data.verified || false
        
        setStats([
          { label: "Total Claims", value: String(claimedDonations.length), icon: Package, color: "text-blue-600" },
          { label: "Items Received", value: String(totalItems), icon: TrendingUp, color: "text-green-600" },
          { label: "People Served", value: String(peopleServed), icon: Users, color: "text-purple-600" },
          { label: "Verification Status", value: verified ? "Verified" : "Pending", icon: Clock, color: verified ? "text-green-600" : "text-amber-600" },
        ])
      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setLoadingStats(false)
      }
    })()
    return () => { mounted = false }
  }, [donations])

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "delivered":
        return "bg-green-100 text-green-700"
      case "pending":
      case "claimed":
        return "bg-amber-100 text-amber-700"
      case "rejected":
      case "in-transit":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome, NGO Dashboard</h1>
          <p className="text-muted-foreground">Your NGO dashboard overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loadingStats ? (
          stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">0</p>
                    </div>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Volunteer Applications</CardTitle>
            <CardDescription>People who applied for your tasks</CardDescription>
          </div>
          <Link href="/ngo/claims">
            <Button variant="outline">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{app.volunteer?.name || app.volunteer?.email}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Applied for: {app.task?.title}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>{app.status}</span>
                  <div className="flex gap-2">
                    {app.status === 'pending' && (
                      <>
                        <Button size="sm" onClick={() => handleDecision(app.id, 'approve')}>Approve</Button>
                        <Button size="sm" variant="outline" onClick={() => handleDecision(app.id, 'reject')}>Reject</Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {applications.length === 0 && <div className="text-sm text-muted-foreground">No applications yet.</div>}
          </div>
        </CardContent>
      </Card>

      {/* Recent donations to this NGO */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Donations</CardTitle>
            <CardDescription>Donations received by your organization</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={async () => {
              try {
                const res = await fetch('/api/ngo/donations', { credentials: 'same-origin' })
                if (!res.ok) return
                const data = await res.json()
                setDonations(data.donations || [])
                toast({ title: 'Updated', description: 'Donations refreshed' })
              } catch (err) { console.error(err); toast({ title: 'Error', description: 'Could not refresh donations' }) }
            }}>Refresh</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {donations.length === 0 ? (
              <div className="text-sm text-muted-foreground">No donations yet.</div>
            ) : (
              donations.map((d) => (
                <div key={d.id} className="p-3 border border-border rounded">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-semibold">{d.title}</div>
                      <div className="text-sm text-muted-foreground">From: {d.donor?.name || d.donor?.email}</div>
                      <div className="mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(d.status)}`}>
                          {d.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col gap-2">
                      <div className="text-sm">{d.items ?? 0} items</div>
                      <div className="text-xs text-muted-foreground">{new Date(d.createdAt).toLocaleString()}</div>
                      {d.ngoId && d.status !== 'delivered' && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={async () => {
                            try {
                              const res = await fetch('/api/ngo/donations/update-status', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ donationId: d.id, status: 'delivered' }),
                                credentials: 'same-origin',
                              })
                              if (!res.ok) {
                                const data = await res.json()
                                toast({ title: 'Error', description: data.error || 'Failed to update status', variant: 'destructive' })
                                return
                              }
                              toast({ title: 'Success', description: 'Donation marked as delivered. Donor will be notified.' })
                              // Refresh donations
                              const refreshRes = await fetch('/api/ngo/donations', { credentials: 'same-origin' })
                              if (refreshRes.ok) {
                                const refreshData = await refreshRes.json()
                                setDonations(refreshData.donations || [])
                              }
                            } catch (err) {
                              console.error(err)
                              toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' })
                            }
                          }}
                        >
                          Mark Delivered
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Browse Available Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Find new donation opportunities in your service area.</p>
            <Link href="/map">
              <Button variant="outline">
                <MapPin className="w-4 h-4 mr-2" />
                View Donations Map
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg">Manage Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Update your organization information and preferences.</p>
            <Link href="/ngo/profile">
              <Button variant="outline">Edit Profile</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
