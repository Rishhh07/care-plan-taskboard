import { http, HttpResponse, delay } from 'msw'
import type { Patient, Task } from '../api/types'

const patients: Patient[] = [
  { id: 'p1', name: 'Ramesh Kumar', dob: '1958-04-12', unit: 'Unit A' },
  { id: 'p2', name: 'Sunita Devi', dob: '1963-07-22', unit: 'Unit B' },
  { id: 'p3', name: 'Mohan Lal', dob: '1970-01-15', unit: 'Unit A' },
]

const tasks: Task[] = [
  {
    id: 't1', patientId: 'p1', title: 'Monthly Lab Test',
    category: 'lab', status: 'overdue', assignedRole: 'nurse',
    assignee: 'Priya', dueDate: '2026-04-20', createdAt: '2026-04-01',
  },
  {
    id: 't2', patientId: 'p1', title: 'Diet Counselling',
    category: 'diet_counselling', status: 'in_progress', assignedRole: 'dietician',
    dueDate: '2026-04-27', createdAt: '2026-04-01',
  },
  {
    id: 't3', patientId: 'p2', title: 'Vaccination Reminder',
    category: 'vaccination', status: 'completed', assignedRole: 'nurse',
    assignee: 'Rahul', dueDate: '2026-04-25', createdAt: '2026-04-01',
  },
  {
    id: 't4', patientId: 'p2', title: 'Social Work Follow-up',
    category: 'social_work', status: 'in_progress', assignedRole: 'social_worker',
    dueDate: '2026-04-28', createdAt: '2026-04-01',
  },
  {
    id: 't5', patientId: 'p3', title: 'Access Check',
    category: 'access_check', status: 'overdue', assignedRole: 'nurse',
    dueDate: '2026-04-22', createdAt: '2026-04-01',
  },
]

export const handlers = [
  http.get('/api/patients', async () => {
    await delay(500)
    return HttpResponse.json(patients)
  }),

  http.get('/api/patients/:id/tasks', async ({ params }) => {
    await delay(300)
    const patientTasks = tasks.filter(t => t.patientId === params.id)
    return HttpResponse.json(patientTasks)
  }),

  http.post('/api/patients/:id/tasks', async ({ request, params }) => {
    await delay(300)
    const body = await request.json() as Omit<Task, 'id' | 'createdAt'>
    const newTask: Task = {
      ...body,
      id: `t${Date.now()}`,
      patientId: params.id as string,
      createdAt: new Date().toISOString(),
    }
    tasks.push(newTask)
    return HttpResponse.json(newTask, { status: 201 })
  }),

  http.patch('/api/tasks/:id', async ({ request, params }) => {
    await delay(300)
    const body = await request.json() as Partial<Task>
    const index = tasks.findIndex(t => t.id === params.id)
    if (index === -1) return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    tasks[index] = { ...tasks[index], ...body }
    return HttpResponse.json(tasks[index])
  }),
]