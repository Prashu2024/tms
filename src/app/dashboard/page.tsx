'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface DashboardData {
  stats: {
    totalProjects: number
    totalTasks: number
    assignedTasks: number
  }
  tasksByStatus: Array<{
    status: string
    _count: { status: number }
  }>
  tasksByPriority: Array<{
    priority: string
    _count: { priority: number }
  }>
  recentTasks: Array<{
    id: string
    title: string
    status: string
    priority: string
    createdAt: string
    project: {
      id: string
      name: string
    }
  }>
  upcomingTasks: Array<{
    id: string
    title: string
    status: string
    priority: string
    dueDate: string
    project: {
      id: string
      name: string
    }
  }>
  projectStats: Array<{
    id: string
    name: string
    tasks: Array<{
      id: string
      status: string
    }>
  }>
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      const response = await fetch('/api/dashboard')
      if (response.ok) {
        const dashboardData = await response.json()
        setData(dashboardData)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  function getStatusCount(status: string) {
    return data?.tasksByStatus.find(s => s.status === status)?._count.status || 0
  }

  function getPriorityCount(priority: string) {
    return data?.tasksByPriority.find(p => p.priority === priority)?._count.priority || 0
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'TODO': return 'bg-gray-100 text-gray-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      case 'DONE': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  function getPriorityColor(priority: string) {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'LOW': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="flex justify-center py-8">Loading dashboard...</div>
  }

  if (!data) {
    return <div className="text-center py-8">Failed to load dashboard data</div>
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Overview of your projects and tasks
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-3xl font-bold text-indigo-600">{data.stats.totalProjects}</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Projects</dt>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <Link href="/projects" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all projects
            </Link>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-3xl font-bold text-indigo-600">{data.stats.totalTasks}</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Tasks</dt>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <Link href="/tasks" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all tasks
            </Link>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-3xl font-bold text-orange-600">{data.stats.assignedTasks}</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tasks Assigned to You</dt>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <Link href="/tasks?assignedToMe=true" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View my tasks
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tasks by Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium text-gray-600">To Do</span>
              <span className="text-lg font-bold text-gray-900">{getStatusCount('TODO')}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
              <span className="text-sm font-medium text-blue-600">In Progress</span>
              <span className="text-lg font-bold text-blue-900">{getStatusCount('IN_PROGRESS')}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded">
              <span className="text-sm font-medium text-green-600">Done</span>
              <span className="text-lg font-bold text-green-900">{getStatusCount('DONE')}</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tasks by Priority</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded">
              <span className="text-sm font-medium text-red-600">High Priority</span>
              <span className="text-lg font-bold text-red-900">{getPriorityCount('HIGH')}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
              <span className="text-sm font-medium text-yellow-600">Medium Priority</span>
              <span className="text-lg font-bold text-yellow-900">{getPriorityCount('MEDIUM')}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded">
              <span className="text-sm font-medium text-green-600">Low Priority</span>
              <span className="text-lg font-bold text-green-900">{getPriorityCount('LOW')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Tasks</h3>
            <Link href="/tasks" className="text-sm text-indigo-600 hover:text-indigo-500">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {data.recentTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent tasks</p>
            ) : (
              data.recentTasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Link href={`/tasks?projectId=${task.project.id}`} className="font-medium text-gray-900 hover:text-indigo-600">
                      {task.title}
                    </Link>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {task.project.name} • 
                    <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Upcoming Deadlines</h3>
            <Link href="/tasks?assignedToMe=true" className="text-sm text-indigo-600 hover:text-indigo-500">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {data.upcomingTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming deadlines</p>
            ) : (
              data.upcomingTasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{task.title}</span>
                    <span className="text-sm text-orange-600 font-medium">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {task.project.name}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Project Overview</h3>
          <Link href="/projects" className="text-sm text-indigo-600 hover:text-indigo-500">
            View all projects
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.projectStats.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center py-4">No projects yet</p>
          ) : (
            data.projectStats.map((project) => {
              const completedTasks = project.tasks.filter(t => t.status === 'DONE').length
              const totalTasks = project.tasks.length
              const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

              return (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{project.name}</h4>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>{completedTasks} of {totalTasks} tasks completed</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}