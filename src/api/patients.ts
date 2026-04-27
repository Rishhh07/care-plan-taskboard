import client from './client'
import type { Patient } from './types'

export const getPatients = async (): Promise<Patient[]> => {
  const res = await client.get('/patients')
  return res.data
}