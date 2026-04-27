import type { TaskStatus } from '../../api/types'

const colours: Record<TaskStatus, string> = {
  overdue: '#fee2e2',
  in_progress: '#fef9c3',
  completed: '#dcfce7',
}

const labels: Record<TaskStatus, string> = {
  overdue: 'Overdue',
  in_progress: 'In Progress',
  completed: 'Completed',
}

export const StatusBadge = ({ status }: { status: TaskStatus }) => (
  <span style={{
    background: colours[status],
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
  }}>
    {labels[status]}
  </span>
)