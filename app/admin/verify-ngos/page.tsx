"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Eye } from "lucide-react"
import { useToast } from '@/hooks/use-toast'

type NGO = {
  id: number
  name: string
  verified: boolean
  createdAt: string
  user?: {
    id: number
    name: string | null
    email: string
  } | null
}

export default function VerifyNGOsPage() {
  const [ngos, setNgos] = useState<NGO[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNGO, setSelectedNGO] = useState<NGO | null>(null)
  const [showModal, setShowModal] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/admin/ngos', { credentials: 'same-origin' })
        if (!res.ok) return
        const data = await res.json()
        if (!mounted) return
        setNgos(data.ngos || [])
      } catch (err) {
        console.error(err)
        toast({ title: 'Error', description: 'Failed to load NGOs', variant: 'destructive' })
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [toast])

  const handleApprove = async (ngoId: number) => {
    try {
      const res = await fetch('/api/admin/verify-ngo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ngoId, action: 'approve' }),
        credentials: 'same-origin',
      })
      if (!res.ok) {
        const data = await res.json()
        toast({ title: 'Error', description: data.error || 'Failed to approve NGO', variant: 'destructive' })
        return
      }
      setNgos((prev) => prev.map((ngo) => (ngo.id === ngoId ? { ...ngo, verified: true } : ngo)))
      setShowModal(false)
      setSelectedNGO(null)
      toast({ title: 'Success', description: 'NGO approved successfully' })
    } catch (err) {
      console.error(err)
      toast({ title: 'Error', description: 'Failed to approve NGO', variant: 'destructive' })
    }
  }

  const handleReject = async (ngoId: number) => {
    try {
      const res = await fetch('/api/admin/verify-ngo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ngoId, action: 'reject' }),
        credentials: 'same-origin',
      })
      if (!res.ok) {
        const data = await res.json()
        toast({ title: 'Error', description: data.error || 'Failed to reject NGO', variant: 'destructive' })
        return
      }
      setNgos((prev) => prev.map((ngo) => (ngo.id === ngoId ? { ...ngo, verified: false } : ngo)))
      setShowModal(false)
      setSelectedNGO(null)
      toast({ title: 'Success', description: 'NGO verification removed' })
    } catch (err) {
      console.error(err)
      toast({ title: 'Error', description: 'Failed to reject NGO', variant: 'destructive' })
    }
  }

  const getStatusColor = (verified: boolean) => {
    if (verified) {
      return "bg-green-100 text-green-800"
    }
    return "bg-amber-100 text-amber-800"
  }

  const pendingNGOs = ngos.filter((ngo) => !ngo.verified)
  const verifiedNGOs = ngos.filter((ngo) => ngo.verified)

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">NGO Verification</h1>
        <p className="text-muted-foreground">Review and approve organization registrations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-amber-600">{loading ? "0" : String(pendingNGOs.length || 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Verified</p>
            <p className="text-2xl font-bold text-green-600">{loading ? "0" : String(verifiedNGOs.length || 0)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending NGOs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Applications</CardTitle>
          <CardDescription>NGOs awaiting verification</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingNGOs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No pending applications</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr className="text-muted-foreground">
                    <th className="text-left py-3 px-4 font-medium">Organization</th>
                    <th className="text-left py-3 px-4 font-medium">Contact Email</th>
                    <th className="text-left py-3 px-4 font-medium">Registered Date</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingNGOs.map((ngo) => (
                    <tr key={ngo.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{ngo.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{ngo.user?.email || 'N/A'}</td>
                      <td className="py-3 px-4 text-muted-foreground">{new Date(ngo.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedNGO(ngo)
                              setShowModal(true)
                            }}
                            className="bg-transparent"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(ngo.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleReject(ngo.id)}>
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verified NGOs */}
      <Card>
        <CardHeader>
          <CardTitle>Verified Organizations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {verifiedNGOs.map((ngo) => (
              <div key={ngo.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium">{ngo.name}</p>
                  <p className="text-xs text-muted-foreground">{ngo.user?.email || 'N/A'}</p>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {showModal && selectedNGO && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{selectedNGO.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Organization Name</p>
                <p className="font-medium">{selectedNGO.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Contact Email</p>
                <p className="font-medium">{selectedNGO.user?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Contact Name</p>
                <p className="font-medium">{selectedNGO.user?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Registration Date</p>
                <p className="font-medium">{new Date(selectedNGO.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Verification Status</p>
                <p className="font-medium">{selectedNGO.verified ? "Verified" : "Pending"}</p>
              </div>

              <div className="pt-4 border-t border-border flex gap-2">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleApprove(selectedNGO.id)}
                >
                  Approve
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => handleReject(selectedNGO.id)}>
                  Reject
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowModal(false)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
