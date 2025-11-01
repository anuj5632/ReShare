import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserFromCookie } from '@/lib/auth'
import { publishDonation } from '@/lib/events'

export async function GET() {
  try {
    const user = await getUserFromCookie()
    if (!user) return NextResponse.json({ donations: [] })

    const donations = await prisma.donation.findMany({
      where: { donorId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ donations })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ donations: [] }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const raw = await req.text()
    console.log('POST /api/donor/donations raw body:', raw)
    let body: any
    try {
      body = JSON.parse(raw)
    } catch (e) {
      body = {}
    }
    const user = await getUserFromCookie()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    const { title, quantity } = body
    console.log('Parsed body:', { title, quantity })
    if (!title) return NextResponse.json({ error: 'Missing title' }, { status: 400 })

    const items = Number(quantity) || 1

    const donation = await prisma.donation.create({
      data: {
        title,
        items,
        donorId: user.id,
        status: 'pending',
      },
    })

    // publish donation event for realtime subscribers
    try {
      publishDonation({ donation })
    } catch (e) {
      // non-fatal - emitter may fail in some serverless runtimes
      console.warn('Failed to publish donation event', e)
    }

    return NextResponse.json({ donation })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
