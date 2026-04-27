import { StatusBadge } from '../ui/StatusBadge'
import { useUpdateTask } from '../../hooks/useTasks'
import type { Task, TaskStatus } from '../../api/types'

const nextStatus: Record<TaskStatus, TaskStatus> = {
  overdue: 'in_progress',
  in_progress: 'completed',
  completed: 'completed',
}

export const TaskCard = ({ task }: { task: Task }) => {
  const { mutate: updateTask, isPending } = useUpdateTask(task.patientId)

  const handleAdvance = () => {
    if (task.status === 'completed') return
    updateTask({ taskId: task.id, data: { status: nextStatus[task.status] } })
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px', marginBottom: '8px', opacity: isPending ? 0.6 : 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontWeight: 600, fontSize: '14px' }}>{task.title}</span>
        <StatusBadge status={task.status} />
      </div>
      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
        {task.assignedRole}{task.assignee ? ` — ${task.assignee}` : ''}
      </div>
      <div style={{ fontSize: '12px', color: '#6b7280' }}>
        Due: {task.dueDate}
      </div>
      {task.status !== 'completed' && (
        <button onClick={handleAdvance} disabled={isPending}
          style={{ marginTop: '8px', padding: '4px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #d1d5db', cursor: 'pointer', background: '#f9fafb' }}>
          {isPending ? 'Saving...' : task.status === 'overdue' ? '→ In Progress' : '→ Complete'}
        </button>
      )}
    </div>
  )
}