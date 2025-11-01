"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

type TrendPoint = { week: string; donations: number; items: number; people?: number }
type Sustainability = { metric: string; value: number }
type Category = { name: string; value: number; color?: string }

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [donationTrends, setDonationTrends] = useState<TrendPoint[]>([])
  const [categoryDistribution, setCategoryDistribution] = useState<Category[]>([])
  const [sustainabilityMetrics, setSustainabilityMetrics] = useState<Sustainability[]>([])
  const [totals, setTotals] = useState({ totalDonations: 0, totalItems: 0, distinctDonors: 0 })

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
  const res = await fetch('/api/admin/analytics', { credentials: 'same-origin' })
        if (!res.ok) throw new Error('Failed to load analytics')
        const data = await res.json()
        if (!mounted) return

        setTotals({
          totalDonations: data.totalDonations ?? 0,
          totalItems: data.totalItems ?? 0,
          distinctDonors: data.distinctDonors ?? 0,
        })

        setDonationTrends((data.donationTrends as TrendPoint[]) || [])
        setCategoryDistribution((data.categoryDistribution as Category[]) || [])
        setSustainabilityMetrics((data.sustainability as Sustainability[]) || [])
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

  // fallback colors if categories empty
  const defaultCategories = [
    { name: 'Clothing', value: 32, color: '#2d7a8b' },
    { name: 'Books', value: 18, color: '#d4a373' },
    { name: 'Electronics', value: 15, color: '#4a9ebb' },
    { name: 'Food', value: 20, color: '#7fb069' },
    { name: 'Other', value: 15, color: '#a2a2a2' },
  ]

  const categoriesToShow = categoryDistribution.length ? categoryDistribution : defaultCategories

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">Platform performance and impact metrics</p>
      </div>

      {/* Sustainability Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading metrics...</div>
        ) : (
          sustainabilityMetrics.map((metric, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground font-medium">{metric.metric}</p>
                <p className="text-2xl font-bold mt-2">{metric.value.toLocaleString()}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Donation Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Donation Trends</CardTitle>
          <CardDescription>Weekly statistics for the current month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={donationTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="donations" fill="var(--color-primary)" name="Donations" />
              <Bar dataKey="items" fill="var(--color-accent)" name="Items" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Donation Categories</CardTitle>
            <CardDescription>Distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoriesToShow}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoriesToShow.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* People Served */}
        <Card>
          <CardHeader>
            <CardTitle>Impact Over Time</CardTitle>
            <CardDescription>Cumulative people served</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={donationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="people"
                  stroke="var(--color-primary)"
                  name="People Served"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="font-semibold text-green-900 mb-1">Totals</p>
            <p className="text-sm text-green-800">
              Total donations: {totals.totalDonations.toLocaleString()}. Total items: {totals.totalItems.toLocaleString()}.
            </p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="font-semibold text-blue-900 mb-1">Top Category</p>
            <p className="text-sm text-blue-800">{categoriesToShow.length ? `${categoriesToShow[0].name} is the top category.` : 'No category data available yet.'}</p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="font-semibold text-purple-900 mb-1">Community Impact</p>
            <p className="text-sm text-purple-800">Distinct donors: {totals.distinctDonors.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
