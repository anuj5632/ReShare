import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserFromCookie } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getUserFromCookie()
    
    // return tasks that are not yet assigned (volunteerId is null) and upcoming
    const tasks = await prisma.task.findMany({ 
      where: { volunteerId: null, status: 'upcoming' }, 
      include: { ngo: true },
      orderBy: { date: 'asc' } 
    })
    
    // If user is logged in as volunteer, check their application status for each task
    let tasksWithStatus: any[] = []
    if (user && user.role === 'VOLUNTEER') {
      const applications = await prisma.volunteerApplication.findMany({
        where: { volunteerId: user.id },
        select: { taskId: true, status: true }
      })
      
      const applicationMap = new Map(
        applications.map(app => [app.taskId, app.status])
      )
      
      tasksWithStatus = tasks.map(task => ({
        id: task.id,
        title: task.title,
        ngoId: task.ngoId,
        volunteerId: task.volunteerId,
        status: task.status,
        date: task.date,
        time: task.time,
        location: task.location,
        createdAt: task.createdAt,
        applicationStatus: applicationMap.get(task.id) || null,
        ngo: task.ngo ? { name: task.ngo.name } : null
      }))
    } else {
      // For non-logged in users or non-volunteers, don't show application status
      tasksWithStatus = tasks.map(task => ({
        id: task.id,
        title: task.title,
        ngoId: task.ngoId,
        volunteerId: task.volunteerId,
        status: task.status,
        date: task.date,
        time: task.time,
        location: task.location,
        createdAt: task.createdAt,
        applicationStatus: null,
        ngo: task.ngo ? { name: task.ngo.name } : null
      }))
    }
    
    return NextResponse.json({ tasks: tasksWithStatus })
  } catch (err) {
    console.error('available tasks error', err)
    return NextResponse.json({ tasks: [] }, { status: 500 })
  }
}
