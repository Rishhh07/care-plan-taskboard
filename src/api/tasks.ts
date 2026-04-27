import client from './client'
import type { Task, CreateTaskDTO, UpdateTaskDTO } from './types'

export const getTasks = async (patientId: string): Promise<Task[]> => {
  const res = await client.get(`/patients/${patientId}/tasks`)
  return res.data
}

export const createTask = async (patientId: string, data: CreateTaskDTO): Promise<Task> => {
  const res = await client.post(`/patients/${patientId}/tasks`, data)
  return res.data
}

export const updateTask = async (taskId: string, data: UpdateTaskDTO): Promise<Task> => {
  const res = await client.patch(`/tasks/${taskId}`, data)
  return res.data
}