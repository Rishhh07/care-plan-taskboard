import { describe, it, expect } from 'vitest'
import type { Task } from '../api/types'

// Testing our filter logic in isolation
const isToday = (date: string) => new Date(date).toDateString() === new Date().toDateString()
const isPast = (date: string) => new Date(date) < new Date()
const isFuture = (date: string) => new Date(date) > new Date()

const filterTasks = (tasks: Task[], role: string, time: string) => {
  return tasks.filter(task => {
    const roleMatch = role === 'all' || task.assignedRole === role
    const timeMatch =
      time === 'all' ? true :
      time === 'overdue' ? (isPast(task.dueDate) && task.status !== 'completed') :
      time === 'today' ? isToday(task.dueDate) :
      time === 'upcoming' ? isFuture(task.dueDate) : true
    return roleMatch && timeMatch
  })
}

const mockTasks: Task[] = [
  {
    id: 't1', patientId: 'p1', title: 'Lab Test',
    category: 'lab', status: 'overdue', assignedRole: 'nurse',
    dueDate: '2026-04-01', createdAt: '2026-03-01',
  },
  {
    id: 't2', patientId: 'p1', title: 'Diet Check',
    category: 'diet_counselling', status: 'completed', assignedRole: 'dietician',
    dueDate: '2026-04-01', createdAt: '2026-03-01',
  },
  {
    id: 't3', patientId: 'p1', title: 'Follow-up',
    category: 'social_work', status: 'in_progress', assignedRole: 'social_worker',
    dueDate: '2026-05-01', createdAt: '2026-03-01',
  },
]

describe('filterTasks', () => {
  it('returns all tasks when role and time are all', () => {
    expect(filterTasks(mockTasks, 'all', 'all')).toHaveLength(3)
  })

  it('filters by role correctly', () => {
    const result = filterTasks(mockTasks, 'nurse', 'all')
    expect(result).toHaveLength(1)
    expect(result[0].assignedRole).toBe('nurse')
  })

  it('filters overdue tasks — excludes completed even if past due', () => {
    const result = filterTasks(mockTasks, 'all', 'overdue')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('t1')
  })

  it('filters upcoming tasks correctly', () => {
    const result = filterTasks(mockTasks, 'all', 'upcoming')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('t3')
  })
})