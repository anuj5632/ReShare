import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserFromCookie } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getUserFromCookie()
    if (!user) return NextResponse.json({ tasks: [] })

    // return tasks the user has been approved for via VolunteerApplication
    const apps = await (prisma as any).volunteerApplication.findMany({
      where: { volunteerId: user.id, status: 'approved' },
      include: { task: { include: { ngo: true } } },
      orderBy: { createdAt: 'desc' },
    })

    const tasks = apps.map((a: any) => ({ ...a.task }))

    return NextResponse.json({ tasks })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ tasks: [] }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromCookie()
    if (!user || user.role !== 'VOLUNTEER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const taskId = Number(body.taskId)
    const message = body.message ? String(body.message) : undefined
    if (!taskId) return NextResponse.json({ error: 'Invalid taskId' }, { status: 400 })

    // find task
    const task = await prisma.task.findUnique({ where: { id: taskId } })
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    if (task.volunteerId) return NextResponse.json({ error: 'Task already taken' }, { status: 400 })

    // Check if volunteer already has an application for this task
    const existingApp = await prisma.volunteerApplication.findFirst({
      where: {
        volunteerId: user.id,
        taskId: taskId
      }
    })

    if (existingApp) {
      return NextResponse.json({ 
        error: 'You have already applied to this task',
        application: existingApp 
      }, { status: 400 })
    }

    // Verify task has an NGO
    if (!task.ngoId) {
      console.error('Volunteer application: Task has no ngoId', { taskId, task: { id: task.id, title: task.title } })
      return NextResponse.json({ error: 'Task is not associated with an NGO' }, { status: 400 })
    }

    // create volunteer application (pending)
    const app = await prisma.volunteerApplication.create({
      data: {
        volunteerId: user.id,
        taskId: taskId,
        message,
        status: 'pending',
      },
    })

    console.log('Volunteer application created:', {
      applicationId: app.id,
      volunteerId: user.id,
      taskId: taskId,
      taskNgoId: task.ngoId,
      status: app.status
    })

    return NextResponse.json({ application: app })
  } catch (err) {
    console.error('volunteer tasks POST error', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
