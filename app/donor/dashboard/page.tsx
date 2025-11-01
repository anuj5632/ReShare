"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Gift, MapPin, User2, TrendingUp, ArrowRight, Plus, Package } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { useToast } from '@/hooks/use-toast'

type RecentDonation = {
  id: number
  title: string
  items: number
  status: string
  ngoName?: string | null
  createdAt: string
}

export default function DonorDashboard() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ name?: string | null; email: string } | null>(null)
  const [stats, setStats] = useState([
    { label: "Total Donations", value: "0", icon: Gift, color: "text-blue-600" },
    { label: "Items Donated", value: "0", icon: Package, color: "text-green-600" },
    { label: "People Helped", value: "0", icon: User2, color: "text-purple-600" },
    { label: "Impact Points", value: "0", icon: TrendingUp, color: "text-amber-600" },
  ])
  const [recent, setRecent] = useState<RecentDonation[]>([])
  const { toast } = useToast()
  const lastStatuses = useRef<Map<number, string>>(new Map())

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        // Fetch user info
        const meRes = await fetch('/api/auth/me', { credentials: 'same-origin' })
        if (!meRes.ok) {
          if (mounted) setLoading(false)
          return
        }
        const meData = await meRes.json()
        if (!mounted) return
        setUser(meData.user)

        // Fetch donations
        const donationsRes = await fetch('/api/donor/donations', { credentials: 'same-origin' })
        if (!donationsRes.ok) {
          if (mounted) setLoading(false)
          return
        }
        const donationsData = await donationsRes.json()
        if (!mounted) return

        const donations = donationsData.donations || []
        const totalDonations = donations.length
        const itemsDonated = donations.reduce((sum: number, d: any) => sum + (d.items || 0), 0)
        const peopleHelpedEst = Math.floor(itemsDonated * 2)
        const impactPoints = Math.floor(itemsDonated * 10)

        setStats([
          { label: "Total Donations", value: String(totalDonations), icon: Gift, color: "text-blue-600" },
          { label: "Items Donated", value: String(itemsDonated), icon: Package, color: "text-green-600" },
          { label: "People Helped", value: String(peopleHelpedEst), icon: User2, color: "text-purple-600" },
          { label: "Impact Points", value: String(impactPoints), icon: TrendingUp, color: "text-amber-600" },
        ])

        // Store recent donations and track status changes
        const recentDonations = donations.slice(0, 5)
        setRecent(recentDonations)

        // Check for status changes to "delivered" and notify
        recentDonations.forEach((donation: RecentDonation) => {
          const lastStatus = lastStatuses.current.get(donation.id)
          if (lastStatus && lastStatus !== 'delivered' && donation.status === 'delivered') {
            toast({
              title: 'Donation Delivered! 🎉',
              description: `Your donation "${donation.title}" has been delivered successfully${donation.ngoName ? ` to ${donation.ngoName}` : ''}.`,
            })
          }
          lastStatuses.current.set(donation.id, donation.status)
        })
      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [toast])

  // Poll for status updates
  useEffect(() => {
    let mounted = true
    const interval = setInterval(async () => {
      try {
        const donationsRes = await fetch('/api/donor/donations', { credentials: 'same-origin' })
        if (!donationsRes.ok || !mounted) return
        const donationsData = await donationsRes.json()
        if (!mounted) return

        const donations = donationsData.donations || []
        const recentDonations = donations.slice(0, 5)

        // Check for status changes to "delivered"
        recentDonations.forEach((donation: RecentDonation) => {
          const lastStatus = lastStatuses.current.get(donation.id)
          if (lastStatus && lastStatus !== 'delivered' && donation.status === 'delivered') {
            toast({
              title: 'Donation Delivered! 🎉',
              description: `Your donation "${donation.title}" has been delivered successfully${donation.ngoName ? ` to ${donation.ngoName}` : ''}.`,
            })
          }
          lastStatuses.current.set(donation.id, donation.status)
        })

        setRecent(recentDonations)
      } catch (err) {
        console.error(err)
      }
    }, 15000) // Poll every 15 seconds

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [toast])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
      case "Delivered":
        return "bg-green-100 text-green-700"
      case "in-transit":
      case "In Transit":
        return "bg-blue-100 text-blue-700"
      case "claimed":
      case "Claimed":
        return "bg-amber-100 text-amber-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  if (!user && !loading) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-2xl font-bold">Please sign in</h1>
        <p className="text-muted-foreground">You need to sign in to view your donor dashboard.</p>
        <div className="mt-4">
          <Link href="/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {loading ? "..." : (user?.name ?? user?.email)}!
          </h1>
          <p className="text-muted-foreground">Here's your donation overview</p>
        </div>
        <Link href="/donor/post-donation">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Donation
          </Button>
        </Link>
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
                    <p className="text-3xl font-bold">{loading ? "0" : (stat.value || "0")}</p>
                  </div>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
          <CardDescription>Your latest donation activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading donations...</div>
            ) : recent.length === 0 ? (
              <div className="text-sm text-muted-foreground">No donations yet. Start by making your first donation!</div>
            ) : (
              recent.map((donation: RecentDonation) => (
                <div
                  key={donation.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{donation.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {donation.ngoName ?? '—'} • {donation.items} items
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(donation.status)}`}>
                        {donation.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Link href={`/donor/donation/${donation.id}`}>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
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
            <CardTitle className="text-lg">Browse Available NGOs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Find organizations near you that are actively receiving donations.
            </p>
            <Link href="/map">
              <Button variant="outline">
                <MapPin className="w-4 h-4 mr-2" />
                View Map
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg">Share Your Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              See the real-world impact of your donations and earn badges.
            </p>
            <Link href="/donor/impact">
              <Button variant="outline">View Impact</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}