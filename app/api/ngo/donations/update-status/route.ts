import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserFromCookie } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const user = await getUserFromCookie()
    if (!user || user.role !== 'NGO') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { donationId, status } = body

    if (!donationId || !status) {
      return NextResponse.json({ error: 'Missing donationId or status' }, { status: 400 })
    }

    // Verify the NGO owns this donation
    const ngo = await prisma.nGO.findFirst({ where: { userId: user.id } })
    if (!ngo) {
      return NextResponse.json({ error: 'NGO not found' }, { status: 403 })
    }

    const donation = await prisma.donation.findUnique({
      where: { id: Number(donationId) },
    })

    if (!donation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 })
    }

    if (donation.ngoId !== ngo.id) {
      return NextResponse.json({ error: 'Not authorized to update this donation' }, { status: 403 })
    }

    // Update donation status
    const updated = await prisma.donation.update({
      where: { id: Number(donationId) },
      data: { status },
    })

    return NextResponse.json({ donation: updated })
  } catch (err) {
    console.error('update donation status error', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
