import { NextResponse } from 'next/server'
import { serialize } from 'cookie'

export async function POST() {
  try {
    const cookie = serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
      sameSite: 'lax',
    })

    const res = NextResponse.json({ ok: true })
    res.headers.set('Set-Cookie', cookie)
    return res
  } catch (err) {
    console.error('Logout error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
