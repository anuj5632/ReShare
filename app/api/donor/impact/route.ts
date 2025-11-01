import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserFromCookie } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getUserFromCookie()
    if (!user || user.role !== 'DONOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const months: Array<{ month: string; start: Date; end: Date }> = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const start = new Date(d.getFullYear(), d.getMonth(), 1)
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 1)
      const label = d.toLocaleString('default', { month: 'short' })
      months.push({ month: label, start, end })
    }

    // Fetch donations for donor in the last 6 months
    const since = months[0].start
    const donations = await prisma.donation.findMany({ where: { donorId: user.id, createdAt: { gte: since } } })

    // Aggregate per month
    const impactData = months.map((m) => {
      const items = donations.filter((d) => d.createdAt >= m.start && d.createdAt < m.end).reduce((s, d) => s + (d.items ?? 0), 0)
      const donationsCount = donations.filter((d) => d.createdAt >= m.start && d.createdAt < m.end).length
      const people = donationsCount // approximate people served as donations count for now
      return { month: m.month, items, people, donations: donationsCount }
    })

    const totalDonations = donations.length
    const totalItems = donations.reduce((s, d) => s + (d.items ?? 0), 0)
    const distinctNgos = Array.from(new Set(donations.map((d) => d.ngoId))).filter((id) => id != null).length

    // Badges logic (simple thresholds)
    const badges = [
      { name: 'First Donation', unlocked: totalDonations >= 1, icon: '🎁' },
      { name: 'Helping Hands', condition: '5 donations', unlocked: totalDonations >= 5, icon: '🤝' },
      { name: 'Sustainability Hero', condition: '50 items donated', unlocked: totalItems >= 50, icon: '🌱' },
      { name: 'Community Champion', condition: '100 people helped', unlocked: distinctNgos >= 100, icon: '🏆' },
    ]

    const sustainability = [
      { metric: 'CO₂ Saved (tons)', value: Number((totalItems * 0.02).toFixed(2)) },
      { metric: 'Waste Diverted (kg)', value: totalItems * 10 },
      { metric: 'Water Saved (liters)', value: totalItems * 20 },
      { metric: 'People Served', value: distinctNgos },
    ]

    const stats = {
      co2: `${Number((totalItems * 0.02).toFixed(0))} kg`,
      people: String(distinctNgos),
      items: String(totalItems),
      points: String(Math.floor(totalItems * 10)),
    }

    return NextResponse.json({ impactData, badges, sustainability, stats })
  } catch (err) {
    console.error('donor impact error', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
