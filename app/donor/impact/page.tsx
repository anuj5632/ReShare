"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Leaf, Users, Zap, Award } from "lucide-react"

type ImpactPoint = { month: string; items: number; people: number }
type Badge = { name: string; unlocked: boolean; condition?: string; icon?: string }

export default function DonorImpactPage() {
  const [impactData, setImpactData] = useState<ImpactPoint[]>([])
  const [badges, setBadges] = useState<Badge[]>([])
  const [stats, setStats] = useState({ co2: '0 kg', people: '0', items: '0', points: '0' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/donor/impact', { credentials: 'same-origin' })
        if (!res.ok) throw new Error('Failed to load impact')
        const data = await res.json()
        if (!mounted) return
        setImpactData((data.impactData as ImpactPoint[]) || [])
        setBadges((data.badges as Badge[]) || [])
        setStats(data.stats || { co2: '0 kg', people: '0', items: '0', points: '0' })
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

  const statsArr = [
    { label: 'CO₂ Saved', value: stats.co2, icon: Leaf, color: 'text-green-600' },
    { label: 'People Helped', value: stats.people, icon: Users, color: 'text-blue-600' },
    { label: 'Items Donated', value: stats.items, icon: Zap, color: 'text-amber-600' },
    { label: 'Impact Points', value: stats.points, icon: Award, color: 'text-purple-600' },
  ]

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Your Impact</h1>
        <p className="text-muted-foreground">See the real-world difference you're making</p>
      </div>

      {/* Impact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : (
          statsArr.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Donation Trends</CardTitle>
          <CardDescription>Your donation activity over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={impactData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="items" fill="var(--color-primary)" name="Items" />
              <Bar dataKey="people" fill="var(--color-accent)" name="People Helped" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Badges & Achievements</CardTitle>
          <CardDescription>Unlock badges by reaching milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {badges.length === 0 && <div className="text-sm text-muted-foreground">No badges yet.</div>}
            {badges.map((badge) => (
              <div
                key={badge.name}
                className={`text-center p-4 rounded-lg border ${
                  badge.unlocked ? 'border-accent/50 bg-accent/10' : 'border-muted bg-muted/20 opacity-50'
                }`}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <p className="font-semibold text-sm">{badge.name}</p>
                {!badge.unlocked && badge.condition && <p className="text-xs text-muted-foreground mt-1">{badge.condition}</p>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sustainability Info */}
      <Card className="bg-gradient-to-br from-green-50 to-primary/5 border-green-200">
        <CardHeader>
          <CardTitle>Sustainability Impact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-green-900">Waste Diverted</p>
              <p className="text-2xl font-bold text-green-700">{loading ? '—' : `${Math.floor(Number(stats.items.replace(/[^0-9]/g, '')) * 10)} kg`}</p>
              <p className="text-xs text-green-600 mt-1">Equal to landfill saved</p>
            </div>
            <div>
              <p className="text-sm font-medium text-green-900">Carbon Reduced</p>
              <p className="text-2xl font-bold text-green-700">{stats.co2}</p>
              <p className="text-xs text-green-600 mt-1">Equivalent to planting trees</p>
            </div>
            <div>
              <p className="text-sm font-medium text-green-900">Water Saved</p>
              <p className="text-2xl font-bold text-green-700">{loading ? '—' : `${Math.floor(Number(stats.items.replace(/[^0-9]/g, '')) * 20)} L`}</p>
              <p className="text-xs text-green-600 mt-1">Manufacturing reduction</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
