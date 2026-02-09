import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const [
      totalProjects,
      totalTasks,
      assignedTasks,
      tasksByStatus,
      tasksByPriority,
      recentTasks,
      upcomingTasks
    ] = await Promise.all([
      prisma.project.count({
        where: {
          OR: [
            { ownerId: userId },
            {
              members: {
                some: { userId }
              }
            }
          ]
        }
      }),

      prisma.task.count({
        where: {
          OR: [
            { createdById: userId },
            { assignedToId: userId },
            {
              project: {
                OR: [
                  { ownerId: userId },
                  {
                    members: {
                      some: { userId }
                    }
                  }
                ]
              }
            }
          ]
        }
      }),

      prisma.task.count({
        where: {
          assignedToId: userId,
          status: { not: 'DONE' }
        }
      }),

      prisma.task.groupBy({
        by: ['status'],
        where: {
          OR: [
            { createdById: userId },
            { assignedToId: userId },
            {
              project: {
                OR: [
                  { ownerId: userId },
                  {
                    members: {
                      some: { userId }
                    }
                  }
                ]
              }
            }
          ]
        },
        _count: {
          status: true
        }
      }),

      prisma.task.groupBy({
        by: ['priority'],
        where: {
          OR: [
            { createdById: userId },
            { assignedToId: userId },
            {
              project: {
                OR: [
                  { ownerId: userId },
                  {
                    members: {
                      some: { userId }
                    }
                  }
                ]
              }
            }
          ]
        },
        _count: {
          priority: true
        }
      }),

      prisma.task.findMany({
        where: {
          OR: [
            { createdById: userId },
            { assignedToId: userId }
          ]
        },
        include: {
          project: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5
      }),

      prisma.task.findMany({
        where: {
          assignedToId: userId,
          status: { not: 'DONE' },
          dueDate: {
            gte: new Date()
          }
        },
        include: {
          project: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          dueDate: 'asc'
        },
        take: 5
      })
    ])

    const projectStats = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            members: {
              some: { userId }
            }
          }
        ]
      },
      include: {
        tasks: {
          select: {
            id: true,
            status: true
          }
        }
      },
      take: 5
    })

    return NextResponse.json({
      stats: {
        totalProjects,
        totalTasks,
        assignedTasks
      },
      tasksByStatus,
      tasksByPriority,
      recentTasks,
      upcomingTasks,
      projectStats
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}