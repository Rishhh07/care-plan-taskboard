import { useState } from 'react'
import { useTasks } from '../../hooks/useTasks'
import { useFilterStore } from '../../store/filterStore'
import { TaskCard } from './TaskCard'
import { CreateTaskModal } from '../TaskForm/CreateTaskModal'
import type { Patient, Task } from '../../api/types'

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

export const PatientRow = ({ patient }: { patient: Patient }) => {
  const { data: tasks, isLoading, isError } = useTasks(patient.id)
  const { roleFilter, timeFilter } = useFilterStore()
  const [showModal, setShowModal] = useState(false)
  const statuses = ['overdue', 'in_progress', 'completed'] as const

  if (isLoading) return <div style={{ padding: '16px', color: '#6b7280' }}>Loading tasks for {patient.name}...</div>
  if (isError) return <div style={{ padding: '16px', color: '#ef4444' }}>Failed to load tasks for {patient.name}</div>

  const filtered = filterTasks(tasks ?? [], roleFilter, timeFilter)

  return (
    <div style={{ borderBottom: '2px solid #e5e7eb', padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: '16px' }}>{patient.name}</span>
          {patient.unit && <span style={{ fontWeight: 400, fontSize: '13px', color: '#6b7280', marginLeft: '8px' }}>{patient.unit}</span>}
        </div>
        <button onClick={() => setShowModal(true)}
          style={{ padding: '6px 14px', background: '#1e40af', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
          + Add Task
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
        {statuses.map(status => (
          <div key={status}>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', marginBottom: '8px' }}>
              {status.replace('_', ' ')}
            </div>
            {filtered.filter(t => t.status === status).length === 0
              ? <div style={{ fontSize: '12px', color: '#9ca3af' }}>No tasks</div>
              : filtered.filter(t => t.status === status).map(task => (
                  <TaskCard key={task.id} task={task} />
                ))
            }
          </div>
        ))}
      </div>

      {showModal && <CreateTaskModal patientId={patient.id} onClose={() => setShowModal(false)} />}
    </div>
  )
}