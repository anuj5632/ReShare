import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret'

export async function POST(req: Request) {
  try {
    const { email, password, reshareName } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    // If user is admin, require reshareName be in allowed list
    if ((user.role || '').toUpperCase() === 'ADMIN') {
      const allowed = ['reshare1', 'reshare2']
      if (!reshareName || !allowed.includes(reshareName)) {
        return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 })
      }
    }

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })

    const cookie = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax'
    })

    const res = NextResponse.json({ id: user.id, email: user.email, name: user.name })
    res.headers.set('Set-Cookie', cookie)
    return res
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
