import { useFilterStore } from '../../store/filterStore'
import type { StaffRole } from '../../api/types'

const roles: { value: StaffRole | 'all'; label: string }[] = [
  { value: 'all', label: 'All Roles' },
  { value: 'nurse', label: 'Nurse' },
  { value: 'dietician', label: 'Dietician' },
  { value: 'social_worker', label: 'Social Worker' },
]

const times = [
  { value: 'all', label: 'All' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'today', label: 'Today' },
  { value: 'upcoming', label: 'Upcoming' },
]

export const FilterBar = () => {
  const { roleFilter, timeFilter, setRoleFilter, setTimeFilter } = useFilterStore()

  return (
    <div style={{ display: 'flex', gap: '12px', padding: '16px', background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: 600 }}>Role:</span>
        {roles.map(r => (
          <button key={r.value} onClick={() => setRoleFilter(r.value)}
            style={{ padding: '4px 12px', borderRadius: '16px', border: '1px solid #d1d5db', cursor: 'pointer', background: roleFilter === r.value ? '#3b82f6' : '#fff', color: roleFilter === r.value ? '#fff' : '#374151', fontWeight: 500, fontSize: '13px' }}>
            {r.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: '16px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600 }}>Time:</span>
        {times.map(t => (
          <button key={t.value} onClick={() => setTimeFilter(t.value as any)}
            style={{ padding: '4px 12px', borderRadius: '16px', border: '1px solid #d1d5db', cursor: 'pointer', background: timeFilter === t.value ? '#3b82f6' : '#fff', color: timeFilter === t.value ? '#fff' : '#374151', fontWeight: 500, fontSize: '13px' }}>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}