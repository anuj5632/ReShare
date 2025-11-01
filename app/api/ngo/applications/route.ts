import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserFromCookie } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getUserFromCookie()
    if (!user || user.role !== 'NGO') return NextResponse.json({ applications: [] }, { status: 401 })

    // find NGO record for this user
    const ngo = await prisma.nGO.findFirst({ where: { userId: user.id } })
    if (!ngo) return NextResponse.json({ applications: [] }, { status: 403 })

    // list applications for tasks belonging to this NGO
    const apps = await prisma.volunteerApplication.findMany({
      where: { task: { ngoId: ngo.id } },
      include: { volunteer: true, task: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ applications: apps })
  } catch (err) {
    console.error('ngo applications GET error', err)
    return NextResponse.json({ applications: [] }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromCookie()
    if (!user || user.role !== 'NGO') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { applicationId, action } = body || {}
    if (!applicationId || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const app = await prisma.volunteerApplication.findUnique({ where: { id: Number(applicationId) }, include: { task: true } })
    if (!app) return NextResponse.json({ error: 'Application not found' }, { status: 404 })

    // ensure the NGO owns the task
    const ngo = await prisma.nGO.findFirst({ where: { userId: user.id } })
    if (!ngo || app.task.ngoId !== ngo.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    if (action === 'approve') {
      // set application approved and assign volunteer to task
      const updatedApp = await prisma.volunteerApplication.update({ where: { id: app.id }, data: { status: 'approved' } })
      await prisma.task.update({ where: { id: app.taskId }, data: { volunteerId: app.volunteerId, status: 'upcoming' } })
      return NextResponse.json({ application: updatedApp })
    } else {
      const updatedApp = await prisma.volunteerApplication.update({ where: { id: app.id }, data: { status: 'rejected' } })
      return NextResponse.json({ application: updatedApp })
    }
  } catch (err) {
    console.error('ngo applications POST error', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
