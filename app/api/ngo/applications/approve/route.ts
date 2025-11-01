import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getUserFromCookie } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const user = await getUserFromCookie()
    if (!user || user.role !== 'NGO') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const applicationId = Number(body.applicationId)
    const action = body.action || 'approve'
    if (!applicationId) return NextResponse.json({ error: 'applicationId required' }, { status: 400 })

    const app = await (prisma as any).volunteerApplication.findUnique({ where: { id: applicationId }, include: { task: true } })
    if (!app) return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    // ensure NGO account belongs to this user and owns the task
    const ngo = await (prisma as any).ngo.findFirst({ where: { userId: user.id } })
    if (!ngo) return NextResponse.json({ error: 'NGO account not found for user' }, { status: 404 })
    const task = await (prisma as any).task.findUnique({ where: { id: app.taskId } })
    if (!task || task.ngoId !== ngo.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (action === 'approve') {
      // set application status and assign volunteer to task
      const updated = await (prisma as any).volunteerApplication.update({ where: { id: applicationId }, data: { status: 'approved' } })
      await (prisma as any).task.update({ where: { id: app.taskId }, data: { volunteerId: app.volunteerId, status: 'assigned' } })
      return NextResponse.json({ success: true, application: updated })
    } else {
      const updated = await (prisma as any).volunteerApplication.update({ where: { id: applicationId }, data: { status: 'rejected' } })
      return NextResponse.json({ success: true, application: updated })
    }
  } catch (err) {
    console.error('approve application error', err)
    return NextResponse.json({ error: 'Internal' }, { status: 500 })
  }
}
