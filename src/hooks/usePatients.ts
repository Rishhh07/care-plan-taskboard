import { useQuery } from '@tanstack/react-query'
import { getPatients } from '../api/patients'

export const usePatients = () => {
  return useQuery({
    queryKey: ['patients'],
    queryFn: getPatients,
  })
}