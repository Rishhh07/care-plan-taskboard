import { create } from 'zustand'
import type { StaffRole } from '../api/types'

type TimeFilter = 'all' | 'overdue' | 'today' | 'upcoming'

interface FilterStore {
  roleFilter: StaffRole | 'all'
  timeFilter: TimeFilter
  setRoleFilter: (role: StaffRole | 'all') => void
  setTimeFilter: (time: TimeFilter) => void
}

export const useFilterStore = create<FilterStore>((set) => ({
  roleFilter: 'all',
  timeFilter: 'all',
  setRoleFilter: (role) => set({ roleFilter: role }),
  setTimeFilter: (time) => set({ timeFilter: time }),
}))