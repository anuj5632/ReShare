import { NextResponse } from 'next/server'
import { getUserFromCookie } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const user = await getUserFromCookie()
    if (!user || user.role !== 'NGO') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ngo = await prisma.nGO.findFirst({ where: { userId: user.id } })
    if (!ngo) {
      return NextResponse.json({ error: 'NGO not found' }, { status: 404 })
    }

    // Get profile data from user
    const profile = {
      name: ngo.name,
      email: user.email,
      verified: ngo.verified,
    }

    // Calculate stats
    const claimedDonations = await prisma.donation.count({
      where: {
        ngoId: ngo.id,
        status: { not: 'pending' }
      }
    })

    const itemsReceived = await prisma.donation.aggregate({
      where: {
        ngoId: ngo.id,
      },
      _sum: {
        items: true
      }
    })

    const totalItems = itemsReceived._sum.items || 0
    const peopleServed = Math.floor(totalItems * 2) // Estimate: 2 people per item

    const stats = {
      totalClaims: claimedDonations,
      itemsReceived: totalItems,
      peopleServed: peopleServed,
    }

    return NextResponse.json({ profile, stats })
  } catch (err) {
    console.error('ngo profile error', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
