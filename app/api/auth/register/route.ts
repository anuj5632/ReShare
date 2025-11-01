import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
  const body = await req.json()
  const { email, password, name, role, meta } = body
    if (!email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    // Prevent admin self-registration
    if ((role || '').toUpperCase() === 'ADMIN') {
      return NextResponse.json({ error: 'Admin accounts cannot be self-registered' }, { status: 403 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'User already exists' }, { status: 409 })

    const hashed = await bcrypt.hash(password, 10)
  const metaString = meta ? JSON.stringify(meta) : null
  const user = await prisma.user.create({ data: { email, password: hashed, name, role: (role || 'DONOR').toUpperCase(), meta: metaString } })
    return NextResponse.json({ id: user.id, email: user.email, name: user.name })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
