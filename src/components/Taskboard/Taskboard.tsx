import { usePatients } from '../../hooks/usePatients'
import { PatientRow } from './PatientRow'
import { FilterBar } from '../ui/FilterBar'

export const Taskboard = () => {
  const { data: patients, isLoading, isError } = usePatients()

  if (isLoading) return <div style={{ padding: '32px', textAlign: 'center' }}>Loading patients...</div>
  if (isError) return <div style={{ padding: '32px', color: '#ef4444', textAlign: 'center' }}>Failed to load patients. Please refresh.</div>
  if (!patients?.length) return <div style={{ padding: '32px', textAlign: 'center' }}>No patients found.</div>

  return (
    <div>
      <FilterBar />
      {patients.map(patient => (
        <PatientRow key={patient.id} patient={patient} />
      ))}
    </div>
  )
}