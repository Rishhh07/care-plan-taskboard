import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTasks, createTask, updateTask } from '../api/tasks'
import type { CreateTaskDTO, UpdateTaskDTO } from '../api/types'

export const useTasks = (patientId: string) => {
  return useQuery({
    queryKey: ['tasks', patientId],
    queryFn: () => getTasks(patientId),
  })
}

export const useUpdateTask = (patientId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskDTO }) =>
      updateTask(taskId, data),

    onMutate: async ({ taskId, data }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', patientId] })
      const previous = queryClient.getQueryData(['tasks', patientId])
      queryClient.setQueryData(['tasks', patientId], (old: any) =>
        old.map((t: any) => t.id === taskId ? { ...t, ...data } : t)
      )
      return { previous }
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(['tasks', patientId], context?.previous)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', patientId] })
    },
  })
}

export const useCreateTask = (patientId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTaskDTO) => createTask(patientId, data),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', patientId] })
    },
  })
}