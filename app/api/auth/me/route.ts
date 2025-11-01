import { NextResponse } from 'next/server'
import { getUserFromCookie } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const user = await getUserFromCookie()
    if (!user) {
      return NextResponse.json({ user: null })
    }

    // Don't send sensitive data back to client
    const { password, ...safeUser } = user
    
    // Include any role-specific data
    let roleData = {}
    if (user.role === 'NGO') {
      // Add NGO-specific data
      const ngoProfile = await prisma.nGO.findFirst({
        where: { userId: user.id }
      })
      if (ngoProfile) {
        roleData = {
          organizationName: ngoProfile.name,
          isVerified: ngoProfile.verified,
        }
      }
    } else if (user.role === 'DONOR') {
      // Add donor-specific data if needed
      const donorStats = await prisma.donation.aggregate({
        where: { donorId: user.id },
        _count: { id: true },
        _sum: { items: true }
      })
      roleData = {
        totalDonations: donorStats._count.id,
        totalItems: donorStats._sum.items || 0
      }
    } else if (user.role === 'VOLUNTEER') {
      // Add volunteer-specific data if needed
      const volunteerStats = await prisma.task.aggregate({
        where: { 
          volunteerId: user.id,
          status: 'completed'
        },
        _count: { id: true }
      })
      roleData = {
        completedTasks: volunteerStats._count.id
      }
    }
    
    return NextResponse.json({ 
      user: {
        ...safeUser,
        roleData
      }
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ user: null })
  }
}
