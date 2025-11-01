import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // Public stats endpoint - no authentication required
    const totalDonations = await prisma.donation.count()
    const totalItemsAgg = await prisma.donation.aggregate({ _sum: { items: true } })
    const totalItems = totalItemsAgg._sum.items ?? 0
    const verifiedNGOs = await prisma.nGO.count({ where: { verified: true } })
    
    // Estimate people helped (rough estimate: 2 items per person)
    const peopleHelped = Math.floor(totalItems * 0.5)

    return NextResponse.json({
      totalItems,
      peopleHelped,
      verifiedNGOs,
    })
  } catch (err) {
    console.error('public stats error', err)
    return NextResponse.json({ 
      totalItems: 0,
      peopleHelped: 0,
      verifiedNGOs: 0,
    })
  }
}

