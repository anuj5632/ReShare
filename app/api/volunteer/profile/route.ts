import { NextResponse } from 'next/server'
import { getUserFromCookie } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const user = await getUserFromCookie()
    if (!user || user.role !== 'VOLUNTEER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse meta field to get volunteer registration data
    let metaData: any = {}
    if (user.meta) {
      try {
        metaData = JSON.parse(user.meta)
      } catch (e) {
        console.error('Failed to parse user meta:', e)
      }
    }

    // Get tasks completed by this volunteer
    const completedTasks = await prisma.task.count({
      where: {
        volunteerId: user.id,
        status: 'completed'
      }
    })

    // Get all tasks assigned to volunteer (for calculating hours estimate)
    const allTasks = await prisma.task.findMany({
      where: {
        volunteerId: user.id
      }
    })

    // Estimate hours volunteered (rough estimate: 2 hours per completed task)
    const hoursVolunteered = completedTasks * 2

    // Parse skills from meta - skills are stored as comma-separated string
    let skills: string[] = []
    if (metaData.skills) {
      // Split by comma and trim each skill, filter out empty strings
      skills = metaData.skills
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0)
    }

    // Calculate badges earned (simple logic based on tasks completed)
    let badgesEarned = 0
    if (completedTasks >= 1) badgesEarned++
    if (completedTasks >= 5) badgesEarned++
    if (completedTasks >= 10) badgesEarned++
    if (completedTasks >= 25) badgesEarned++
    if (hoursVolunteered >= 50) badgesEarned++

    const profile = {
      name: user.name || '',
      email: user.email,
      phone: metaData.phone || '',
      skills: skills,
      availability: metaData.availability || '',
      hoursVolunteered: hoursVolunteered,
      tasksCompleted: completedTasks,
      badgesEarned: badgesEarned,
    }

    return NextResponse.json({ profile })
  } catch (err) {
    console.error('volunteer profile error', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

