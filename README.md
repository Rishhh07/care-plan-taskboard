Another engineer can trace any action from UI → hook → API → mock without asking.

---

## Data Contracts

```typescript
type TaskStatus   = 'overdue' | 'in_progress' | 'completed'
type StaffRole    = 'nurse' | 'dietician' | 'social_worker'
type TaskCategory = 'lab' | 'access_check' | 'diet_counselling' 
                  | 'vaccination' | 'social_work' | 'other'

interface Patient {
  id: string
  name: string
  dob: string      // ISO date
  unit?: string    // optional — UI degrades gracefully if missing
}

interface Task {
  id: string
  patientId: string
  title: string
  category: TaskCategory
  status: TaskStatus
  assignedRole: StaffRole  // required — drives filtering
  assignee?: string        // optional — display metadata only
  dueDate: string          // ISO date
  notes?: string
  createdAt: string
}

type CreateTaskDTO = Omit<Task, 'id' | 'createdAt'>  // server sets these
type UpdateTaskDTO = Partial<Pick<Task, 'status' | 'assignee' | 'dueDate'>>
```

`assignedRole` is required because it drives filtering. `assignee` is optional — if missing, the UI shows only the role. The board still works.

---

## State Management Decision

| Concern | Tool | Why |
|---|---|---|
| Fetching, caching, retries, optimistic updates | React Query | Built for server state — eliminates boilerplate |
| Role filter, time filter | Zustand | Lightweight, no boilerplate, purely local |

**Why not Redux?** Redux is designed for complex client state with many interconnected slices. This app's primary complexity is server state (fetch, cache, sync) — React Query solves that directly. Adding Redux would be over-engineering.

---

## Assumptions & Trade-offs

| Decision | Reasoning |
|---|---|
| No authentication | Out of scope for UI-focused assignment |
| One role per task | Keeps filtering logic simple and unambiguous |
| "Overdue" = past due date AND not completed | Completed is terminal — human decision overrides date logic |
| MSW instead of Express stub | No extra server to run; realistic network interception |
| No pagination | Patient list assumed small (<50); documented as known limitation |
| Completed status is terminal | Prevents false alarms when staff have already resolved a task |

---

## Failure Modes & Robustness

| Scenario | Behaviour |
|---|---|
| Patient list fetch fails | Full-page error message, no crash |
| Task fetch fails for one patient | Per-row error, other patients unaffected |
| Task update fails (network error) | Optimistic update rolled back instantly, user sees error |
| Missing `unit` field on patient | Gracefully hidden — no crash |
| Missing `assignee` field on task | Shows role only — no crash |
| Repeated failures | React Query retries 3x before surfacing error to user |

Optimistic update rollback is implemented via React Query's `onMutate` → snapshot → `onError` → restore pattern in `src/hooks/useTasks.ts`.

---

## Extensibility

**Adding a new role (e.g. physiotherapist):**
1. Add to `StaffRole` type in `src/api/types.ts`
2. Add button in `src/components/ui/FilterBar.tsx`
3. Add to mock seed data in `src/mocks/handlers.ts`

No other files change. The filter logic, task cards, and API layer are all role-agnostic.

**Adding a new task category:**
1. Add to `TaskCategory` type in `src/api/types.ts`
2. Add `<option>` in `src/components/TaskForm/CreateTaskModal.tsx`

---

## Seed Data

Mock data is seeded directly in `src/mocks/handlers.ts`. It includes:
- 3 patients across 2 units
- 5 tasks covering all statuses, roles, and categories
- Simulated network delay (300–500ms) to reflect real-world conditions

No separate seed script is needed — MSW intercepts all API calls automatically on app start.

---

## Known Limitations & Next Steps

- No authentication or role-based access control
- No pagination for large patient lists
- No real-time updates (could add WebSocket or polling)
- Filters not persisted in URL (would improve shareability)
- Mobile layout not fully optimised
- Error messages are plain text — could use toast notifications

---

## Tests

```bash
npx vitest run
```

**7 tests across 2 files:**

`useTasks.test.ts` — tests the core filter logic:
- Returns all tasks when no filter applied
- Filters correctly by role
- Overdue filter excludes completed tasks even if past due date
- Upcoming filter returns only future tasks

`TaskCard.test.tsx` — tests StatusBadge rendering:
- Correct label for each of the 3 statuses

Filter logic was chosen for testing because it contains the most business-critical rules (especially the overdue/completed interaction).

---

## AI Usage

**What I used AI for:**
- Scaffolding folder structure and boilerplate (Vite config, MSW setup, base component shells)
- Generating mock seed data
- Architecture brainstorming (React Query vs Redux decision)

**What I reviewed and changed manually:**
- All TypeScript interfaces and data contracts
- Optimistic update and rollback logic in `useTasks.ts`
- Filter semantics and edge case handling
- This README

**One example where I disagreed with the AI:**
The AI's initial filter logic marked tasks as overdue purely based on date — a completed task with a past due date would show up as overdue. I corrected this to treat `completed` as a terminal status that overrides date comparison. A staff member who has already completed a task should never see it reappear as overdue — that would be a false alarm in a clinical setting.

**Dashboard screenshots**

<img width="1202" height="825" alt="image" src="https://github.com/user-attachments/assets/5c1a5b07-0614-4a52-85ca-9b1501a14a51" />
<img width="1207" height="731" alt="image" src="https://github.com/user-attachments/assets/ea21f03a-f8af-4b2b-b0fc-5339937730df" />
<img width="1199" height="738" alt="image" src="https://github.com/user-attachments/assets/5d8f1c94-e0df-466d-bb30-c23bb4ba31fe" />
<img width="1203" height="634" alt="image" src="https://github.com/user-attachments/assets/18de1891-7b57-46f6-9625-97f490303708" />

**Live Demo**
🔗 https://care-plan-taskboard-six.vercel.app
