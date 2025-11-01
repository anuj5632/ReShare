import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserFromCookie } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getUserFromCookie()
    if (!user || user.role !== 'NGO') {
      console.log('NGO portal GET: Unauthorized - no user or wrong role', { userId: user?.id, role: user?.role })
      return NextResponse.json({ applications: [] }, { status: 401 })
    }

    const ngo = await prisma.nGO.findFirst({ where: { userId: user.id } })
    if (!ngo) {
      console.log('NGO portal GET: NGO not found for user', { userId: user.id, email: user.email })
      return NextResponse.json({ applications: [] }, { status: 403 })
    }

    console.log('NGO portal GET: Fetching applications for NGO', { ngoId: ngo.id, ngoName: ngo.name })

    // Get all volunteer applications for tasks belonging to this NGO
    const apps = await prisma.volunteerApplication.findMany({
      where: { task: { ngoId: ngo.id } },
      include: { 
        volunteer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }, 
        task: {
          select: {
            id: true,
            title: true,
            date: true,
            time: true,
            location: true,
            ngoId: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log('NGO portal GET: Found applications', { count: apps.length, appIds: apps.map(a => a.id) })

    // Debug: Check all tasks for this NGO
    const allTasks = await prisma.task.findMany({
      where: { ngoId: ngo.id },
      select: { id: true, title: true }
    })
    console.log('NGO portal GET: All tasks for this NGO', { taskCount: allTasks.length, taskIds: allTasks.map(t => t.id) })

    // Debug: Check all applications (regardless of NGO)
    const allApps = await prisma.volunteerApplication.findMany({
      include: { task: { select: { id: true, ngoId: true, title: true } } },
      take: 10,
      orderBy: { createdAt: 'desc' }
    })
    console.log('NGO portal GET: Recent applications (for debugging)', {
      count: allApps.length,
      apps: allApps.map(a => ({ appId: a.id, taskId: a.taskId, taskNgoId: a.task.ngoId, taskTitle: a.task.title }))
    })

    return NextResponse.json({ applications: apps, verified: ngo.verified })
  } catch (err) {
    console.error('ngo portal GET error', err)
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

    // Find the application
    const app = await prisma.volunteerApplication.findUnique({ 
      where: { id: Number(applicationId) }, 
      include: { task: true } 
    })
    if (!app) return NextResponse.json({ error: 'Application not found' }, { status: 404 })

    // Verify the NGO owns the task
    const ngo = await prisma.nGO.findFirst({ where: { userId: user.id } })
    if (!ngo) return NextResponse.json({ error: 'NGO not found' }, { status: 403 })
    if (app.task.ngoId !== ngo.id) return NextResponse.json({ error: 'Forbidden - You do not own this task' }, { status: 403 })

    // Check if task is already assigned
    if (app.task.volunteerId && app.task.volunteerId !== app.volunteerId) {
      return NextResponse.json({ error: 'Task has already been assigned to another volunteer' }, { status: 400 })
    }

    if (action === 'approve') {
      // Update application status to approved
      const updatedApp = await prisma.volunteerApplication.update({ 
        where: { id: app.id }, 
        data: { status: 'approved' } 
      })
      
      // Assign volunteer to the task and mark as upcoming
      await prisma.task.update({ 
        where: { id: app.taskId }, 
        data: { 
          volunteerId: app.volunteerId, 
          status: 'upcoming' 
        } 
      })

      // Reject all other pending applications for this task
      await prisma.volunteerApplication.updateMany({
        where: {
          taskId: app.taskId,
          id: { not: app.id },
          status: 'pending'
        },
        data: {
          status: 'rejected'
        }
      })

      return NextResponse.json({ 
        application: updatedApp,
        message: 'Application approved successfully. Volunteer has been assigned to the task.' 
      })
    } else {
      // Reject the application
      const updatedApp = await prisma.volunteerApplication.update({ 
        where: { id: app.id }, 
        data: { status: 'rejected' } 
      })
      return NextResponse.json({ 
        application: updatedApp,
        message: 'Application rejected.' 
      })
    }
  } catch (err) {
    console.error('ngo portal POST error', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
