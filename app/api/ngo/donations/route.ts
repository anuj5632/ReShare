import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserFromCookie } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getUserFromCookie()
    if (!user || user.role !== 'NGO') return NextResponse.json({ donations: [] }, { status: 401 })

    const ngo = await (prisma as any).ngo.findUnique({ where: { userId: user.id } })
    if (!ngo) return NextResponse.json({ donations: [] }, { status: 403 })

    // Return donations assigned to this NGO or unassigned (available) donations so NGOs can see new posts
    const donations = await (prisma as any).donation.findMany({
      where: {
        OR: [
          { ngoId: ngo.id },
          { ngoId: null },
        ],
      },
      include: { donor: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    return NextResponse.json({ donations })
  } catch (err) {
    console.error('GET /api/ngo/donations error', err)
    return NextResponse.json({ donations: [] }, { status: 500 })
  }
}
