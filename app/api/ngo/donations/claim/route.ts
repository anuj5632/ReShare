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
    const { donationId, urgency } = body

    if (!donationId) {
      return NextResponse.json({ error: 'Missing donationId' }, { status: 400 })
    }

    const ngo = await prisma.nGO.findFirst({ where: { userId: user.id } })
    if (!ngo) {
      return NextResponse.json({ error: 'NGO not found' }, { status: 403 })
    }

    const donation = await prisma.donation.findUnique({
      where: { id: Number(donationId) },
      include: { ngo: true },
    })

    if (!donation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 })
    }

    if (donation.ngoId && donation.ngoId !== ngo.id) {
      return NextResponse.json({ error: 'Donation already claimed by another NGO' }, { status: 400 })
    }

    // Update donation to claim it
    const updated = await prisma.donation.update({
      where: { id: Number(donationId) },
      data: {
        ngoId: ngo.id,
        ngoName: ngo.name,
        status: donation.status === 'pending' ? 'claimed' : donation.status,
      },
    })

    // Note: Urgency can be stored in a meta field or we'd need to add it to schema
    // For now, we'll return success. In production, you'd store urgency in a separate field

    return NextResponse.json({ 
      donation: updated,
      message: 'Donation claimed successfully',
      urgency: urgency || 'normal'
    })
  } catch (err) {
    console.error('claim donation error', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
