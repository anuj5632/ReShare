import prisma from './prisma'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret'

export async function getUserFromCookie() {
  try {
    // `cookies()` may be async in some Next versions; await to be safe.
    const cookieStore: any = await cookies()
    const token = cookieStore?.get?.('token')?.value ?? cookieStore?.get?.('token') ?? cookieStore?.token
    if (!token) return null
    const payload: any = jwt.verify(token, JWT_SECRET)
    if (!payload?.sub) return null
    const user = await prisma.user.findUnique({ where: { id: Number(payload.sub) } })
    return user
  } catch (err) {
    console.error('getUserFromCookie error', err)
    return null
  }
}
