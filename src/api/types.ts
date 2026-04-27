export type TaskStatus = 'overdue' | 'in_progress' | 'completed'
export type StaffRole = 'nurse' | 'dietician' | 'social_worker'
export type TaskCategory =
  | 'lab'
  | 'access_check'
  | 'diet_counselling'
  | 'vaccination'
  | 'social_work'
  | 'other'

export interface Patient {
  id: string
  name: string
  dob: string
  unit?: string
}

export interface Task {
  id: string
  patientId: string
  title: string
  category: TaskCategory
  status: TaskStatus
  assignedRole: StaffRole
  assignee?: string
  dueDate: string
  notes?: string
  createdAt: string
}

export type CreateTaskDTO = Omit<Task, 'id' | 'createdAt'>
export type UpdateTaskDTO = Partial<Pick<Task, 'status' | 'assignee' | 'dueDate'>>