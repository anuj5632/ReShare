"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

type Donation = {
  id: number
  title: string
  category?: string
  status: string
  createdAt: string
  items?: number
  ngoName?: string | null
}

export default function DonationHistoryPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/donor/donations')
        const data = await res.json()
        if (!mounted) return
        setDonations(data.donations || [])
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
      case "delivered":
        return "bg-green-100 text-green-800"
      case "in-transit":
        return "bg-blue-100 text-blue-800"
      case "claimed":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filterDonations = (status: string) => {
    if (status === "all") return donations
    return donations.filter((d) => d.status === status)
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Donation History</h1>
        <p className="text-muted-foreground">View all your donations and their current status</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Donations</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="claimed">Claimed</TabsTrigger>
              <TabsTrigger value="in-transit">In Transit</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
            </TabsList>

            {["all", "claimed", "in-transit", "delivered"].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-4 mt-6">
                {loading ? (
                  <div className="text-sm text-muted-foreground">Loading...</div>
                ) : filterDonations(tab).length === 0 ? (
                  <div className="text-sm text-muted-foreground">No donations yet.</div>
                ) : (
                  filterDonations(tab).map((donation) => (
                    <div key={donation.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{donation.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {donation.ngoName || "-"} • {donation.items ?? 1} items
                          </p>
                          <div className="flex gap-2 mt-3">
                            <Badge variant="outline">{donation.category || "General"}</Badge>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}
                            >
                              {donation.status === "in-transit"
                                ? "In Transit"
                                : donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">{new Date(donation.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
