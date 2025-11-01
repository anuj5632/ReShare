import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserFromCookie } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getUserFromCookie()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const totalUsers = await prisma.user.count()
    const totalDonations = await prisma.donation.count()
    const verifiedNGOs = await prisma.nGO.count({ where: { verified: true } })
    const pendingNGOs = await prisma.nGO.count({ where: { verified: false } })

    return NextResponse.json({
      totalUsers,
      totalDonations,
      verifiedNGOs,
      pendingNGOs,
    })
  } catch (err) {
    console.error('admin stats error', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
