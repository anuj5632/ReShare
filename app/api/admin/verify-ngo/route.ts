import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserFromCookie } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const user = await getUserFromCookie()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { ngoId, action } = body

    if (!ngoId || !action) {
      return NextResponse.json({ error: 'Missing ngoId or action' }, { status: 400 })
    }

    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json({ error: 'Invalid action. Must be approve or reject' }, { status: 400 })
    }

    const ngo = await prisma.nGO.findUnique({ where: { id: Number(ngoId) } })
    if (!ngo) {
      return NextResponse.json({ error: 'NGO not found' }, { status: 404 })
    }

    if (action === 'approve') {
      await prisma.nGO.update({
        where: { id: Number(ngoId) },
        data: { verified: true },
      })
    } else {
      // For reject, we could set verified to false or delete. For now, just unverify.
      await prisma.nGO.update({
        where: { id: Number(ngoId) },
        data: { verified: false },
      })
    }

    return NextResponse.json({ success: true, ngo: { ...ngo, verified: action === 'approve' } })
  } catch (err) {
    console.error('verify ngo error', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
