"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Clock, Package, MapPin, Users, AlertCircle, Eye, Plus } from "lucide-react"
import { useToast } from '@/hooks/use-toast'

type Donation = {
  id: number
  title: string
  items: number
  status: string
  donor?: { name?: string; email?: string } | null
  donorId: number
  ngoId: number | null
  createdAt: string
}

export default function NGOClaimsPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [urgencyLevel, setUrgencyLevel] = useState<string>("normal")
  const { toast } = useToast()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/ngo/donations', { credentials: 'same-origin' })
        if (!res.ok) {
          if (mounted) setLoading(false)
          return
        }
        const data = await res.json()
        if (!mounted) return
        setDonations(data.donations || [])
      } catch (err) {
        console.error('Failed to fetch donations:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const refreshDonations = async () => {
    try {
      const res = await fetch('/api/ngo/donations', { credentials: 'same-origin' })
      if (!res.ok) return
      const data = await res.json()
      setDonations(data.donations || [])
    } catch (err) {
      console.error('Failed to refresh donations:', err)
    }
  }

  const availableDonations = donations.filter(d => !d.ngoId || d.status === 'pending')
  const claimedDonations = donations.filter(d => d.ngoId && d.status !== 'pending')

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "claimed":
        return <Package className="w-5 h-5" />
      case "pickup-arranged":
        return <Clock className="w-5 h-5" />
      case "in-transit":
        return <Clock className="w-5 h-5" />
      case "delivered":
        return <CheckCircle className="w-5 h-5" />
      default:
        return <Package className="w-5 h-5" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pickup-arranged":
        return "Pickup Arranged"
      case "in-transit":
        return "In Transit"
      case "claimed":
        return "Claimed"
      case "delivered":
        return "Delivered"
      case "pending":
        return "Pending"
      default:
        return status || "Pending"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-300"
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-300"
      case "normal":
        return "bg-blue-100 text-blue-700 border-blue-300"
      case "low":
        return "bg-gray-100 text-gray-700 border-gray-300"
      default:
        return "bg-blue-100 text-blue-700 border-blue-300"
    }
  }

  const handleViewDetails = (donation: Donation) => {
    setSelectedDonation(donation)
    setIsViewDialogOpen(true)
  }

  const handleClaimClick = (donation: Donation) => {
    setSelectedDonation(donation)
    setUrgencyLevel("normal")
    setIsClaimDialogOpen(true)
  }

  const handleClaim = async () => {
    if (!selectedDonation) return

    try {
      const res = await fetch('/api/ngo/donations/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          donationId: selectedDonation.id,
          urgency: urgencyLevel,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast({
          title: 'Claim Failed',
          description: data.error || 'Could not claim donation',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'Success',
        description: `Claimed "${selectedDonation.title}" with ${urgencyLevel} urgency`,
      })

      setIsClaimDialogOpen(false)
      setSelectedDonation(null)
      await refreshDonations()
    } catch (err) {
      console.error(err)
      toast({
        title: 'Claim Failed',
        description: 'Could not claim donation',
        variant: 'destructive',
      })
    }
  }

  const filterClaims = (status: string) => {
    if (status === "all") return claimedDonations
    if (status === "available") return availableDonations
    return claimedDonations.filter((c) => c.status?.toLowerCase() === status.toLowerCase())
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Claims & Items</h1>
        <p className="text-muted-foreground">View available items, claim donations, and track your claims</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Items Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="available">
            <TabsList>
              <TabsTrigger value="available">
                Available Items ({availableDonations.length})
              </TabsTrigger>
              <TabsTrigger value="all">All Claims</TabsTrigger>
              <TabsTrigger value="claimed">Claimed</TabsTrigger>
              <TabsTrigger value="in-transit">In Transit</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="space-y-4 mt-6">
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : availableDonations.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8">
                  No available items at the moment.
                </div>
              ) : (
                availableDonations.map((donation) => (
                  <div key={donation.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{donation.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          From: {donation.donor?.name || donation.donor?.email || 'Anonymous'}
                        </p>
                      </div>
                      <Badge variant="outline">{donation.items} items</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex gap-2 items-start">
                        <Users className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">Estimated {donation.items * 2} people will benefit</span>
                      </div>
                      <div className="flex gap-2 items-start">
                        <Clock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">Posted: {formatDate(donation.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground">Status: {getStatusLabel(donation.status)}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(donation)}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" onClick={() => handleClaimClick(donation)}>
                          <Plus className="w-4 h-4 mr-1" />
                          Claim
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            {["all", "claimed", "in-transit", "delivered"].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-4 mt-6">
                {loading ? (
                  <div className="text-sm text-muted-foreground">Loading...</div>
                ) : filterClaims(tab).length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-8">
                    No {tab === "all" ? "claims" : tab} items found.
                  </div>
                ) : (
                  filterClaims(tab).map((donation) => (
                    <div key={donation.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{donation.title}</h3>
                            {(donation as any).urgency && (
                              <Badge className={getUrgencyColor((donation as any).urgency)}>
                                {(donation as any).urgency}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            From: {donation.donor?.name || donation.donor?.email || 'Anonymous'}
                          </p>
                        </div>
                        <Badge variant="outline">{donation.items} items</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                        <div className="flex gap-2 items-start">
                          <Users className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">Estimated {donation.items * 2} people will benefit</span>
                        </div>
                        <div className="flex gap-2 items-start">
                          <Clock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">Posted: {formatDate(donation.createdAt)}</span>
                        </div>
                        <div className="flex gap-2 items-start">
                          {getStatusIcon(donation.status)}
                          <span className="font-medium">{getStatusLabel(donation.status)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                          Claimed: {formatDate(donation.createdAt)}
                        </p>
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(donation)}>
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Claim Dialog */}
      <Dialog open={isClaimDialogOpen} onOpenChange={setIsClaimDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Claim Donation</DialogTitle>
            <DialogDescription>
              Claim "{selectedDonation?.title}" and set urgency level
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">Urgency Level</label>
              <Select value={urgencyLevel} onValueChange={setUrgencyLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Not urgent</SelectItem>
                  <SelectItem value="normal">Normal - Standard priority</SelectItem>
                  <SelectItem value="high">High - Urgent</SelectItem>
                  <SelectItem value="critical">Critical - Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm font-medium mb-1">Donation Details:</p>
              <p className="text-sm text-muted-foreground">Items: {selectedDonation?.items}</p>
              <p className="text-sm text-muted-foreground">
                Donor: {selectedDonation?.donor?.name || selectedDonation?.donor?.email || 'Anonymous'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsClaimDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleClaim}>Claim with {urgencyLevel} urgency</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedDonation && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedDonation.title}</DialogTitle>
                <DialogDescription>
                  Donation details and information
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Items</p>
                    <p className="text-lg font-semibold">{selectedDonation.items}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge className="mt-1">{getStatusLabel(selectedDonation.status)}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Donor</p>
                    <p className="text-sm">{selectedDonation.donor?.name || selectedDonation.donor?.email || 'Anonymous'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Posted</p>
                    <p className="text-sm">{formatDate(selectedDonation.createdAt)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Estimated Impact</p>
                  <p className="text-sm">
                    This donation will benefit approximately <strong>{selectedDonation.items * 2} people</strong>
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                {!selectedDonation.ngoId && (
                  <Button onClick={() => {
                    setIsViewDialogOpen(false)
                    handleClaimClick(selectedDonation)
                  }}>
                    Claim This Item
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}