import { useState } from 'react'
import { useCreateTask } from '../../hooks/useTasks'
import type { CreateTaskDTO, StaffRole, TaskCategory } from '../../api/types'

export const CreateTaskModal = ({ patientId, onClose }: { patientId: string; onClose: () => void }) => {
  const { mutate: createTask, isPending } = useCreateTask(patientId)
  const [form, setForm] = useState<CreateTaskDTO>({
    patientId,
    title: '',
    category: 'lab',
    status: 'in_progress',
    assignedRole: 'nurse',
    dueDate: '',
  })

  const handleSubmit = () => {
    if (!form.title || !form.dueDate) return alert('Title and due date are required')
    createTask(form, { onSuccess: onClose })
  }

  const inputStyle = { width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', marginTop: '4px' }
  const labelStyle = { fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginTop: '12px' }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', width: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>New Task</h2>

        <label style={labelStyle}>Title</label>
        <input style={inputStyle} value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Monthly Lab Test" />

        <label style={labelStyle}>Category</label>
        <select style={inputStyle} value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value as TaskCategory })}>
          <option value="lab">Lab</option>
          <option value="access_check">Access Check</option>
          <option value="diet_counselling">Diet Counselling</option>
          <option value="vaccination">Vaccination</option>
          <option value="social_work">Social Work</option>
          <option value="other">Other</option>
        </select>

        <label style={labelStyle}>Assigned Role</label>
        <select style={inputStyle} value={form.assignedRole}
          onChange={e => setForm({ ...form, assignedRole: e.target.value as StaffRole })}>
          <option value="nurse">Nurse</option>
          <option value="dietician">Dietician</option>
          <option value="social_worker">Social Worker</option>
        </select>

        <label style={labelStyle}>Due Date</label>
        <input type="date" style={inputStyle} value={form.dueDate}
          onChange={e => setForm({ ...form, dueDate: e.target.value })} />

        <label style={labelStyle}>Assignee (optional)</label>
        <input style={inputStyle} value={form.assignee ?? ''}
          onChange={e => setForm({ ...form, assignee: e.target.value })} placeholder="e.g. Priya" />

        <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
          <button onClick={handleSubmit} disabled={isPending}
            style={{ flex: 1, padding: '10px', background: '#1e40af', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
            {isPending ? 'Creating...' : 'Create Task'}
          </button>
          <button onClick={onClose}
            style={{ flex: 1, padding: '10px', background: '#f3f4f6', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}