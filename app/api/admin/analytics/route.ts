import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserFromCookie } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getUserFromCookie()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const since = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000) // last 4 weeks

    // Fetch recent donations (last 28 days) and overall aggregates
    const recent = await prisma.donation.findMany({ where: { createdAt: { gte: since } } })
    const totalDonations = await prisma.donation.count()
    const totalItemsAgg = await prisma.donation.aggregate({ _sum: { items: true } })
    const totalItems = totalItemsAgg._sum.items ?? 0

    // distinct donors
    const donorIds = await prisma.donation.findMany({ select: { donorId: true } })
    const distinctDonors = Array.from(new Set(donorIds.map((d) => d.donorId))).length

    // Prepare 4-week trend (Week 1 = oldest, Week 4 = current)
    const weeks = [
      { week: 'Week 1', donations: 0, items: 0, people: 0 },
      { week: 'Week 2', donations: 0, items: 0, people: 0 },
      { week: 'Week 3', donations: 0, items: 0, people: 0 },
      { week: 'Week 4', donations: 0, items: 0, people: 0 },
    ]

    for (const d of recent) {
      const diffDays = Math.floor((now.getTime() - d.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      const weekIndex = Math.floor(diffDays / 7)
      if (weekIndex < 4) {
        // map 0 -> Week 4, 3 -> Week 1
        const idx = 3 - weekIndex
        weeks[idx].donations += 1
        weeks[idx].items += d.items ?? 0
      }
    }

    // people served - approximate by distinct donors or items (we'll expose both)
    const sustainability = [
      { metric: 'CO₂ Saved (tons)', value: Number((totalItems * 0.02).toFixed(2)) },
      { metric: 'Waste Diverted (kg)', value: totalItems * 10 },
      { metric: 'Water Saved (liters)', value: totalItems * 20 },
      { metric: 'People Served', value: distinctDonors },
    ]

    // Category distribution: not explicitly stored yet. Return empty (client can show fallbacks)
    const categoryDistribution: Array<{ name: string; value: number; color: string }> = []

    return NextResponse.json({
      totalDonations,
      totalItems,
      distinctDonors,
      donationTrends: weeks,
      categoryDistribution,
      sustainability,
    })
  } catch (err) {
    console.error('analytics error', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
