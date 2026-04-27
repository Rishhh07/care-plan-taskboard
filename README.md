# Care Plan Taskboard

A frontend dashboard for dialysis center staff to manage and track care plan tasks across patients.

Built as part of the Jano Health SWE Internship take-home assignment.

---

## Setup Instructions

```bash
git clone <your-repo-url>
cd care-plan-taskboard
npm install
npm run dev
```

Open http://localhost:5173

To run tests:
```bash
npx vitest run
```

---

## Architecture Overview

src/
├── api/          # HTTP client, API functions, TypeScript types
├── hooks/        # React Query hooks (data fetching + mutations)
├── store/        # Zustand store (filter state only)
├── components/   # UI components (no API calls)
├── mocks/        # MSW mock handlers (fake backend)
└── tests/        # Vitest + React Testing Library

**Data flow:**
User action → Component → Hook (React Query) → API layer → MSW mock → Cache update → Re-render

---

## State Management

- **React Query** — all server state (fetching, caching, retries, optimistic updates, rollback)
- **Zustand** — local UI state only (role filter, time filter)

React Query was chosen over Redux because this app is primarily server-state-heavy. Redux would add unnecessary boilerplate for what is essentially a fetch-cache-sync problem.

---

## Data Contracts

```typescript
type TaskStatus = 'overdue' | 'in_progress' | 'completed'
type StaffRole = 'nurse' | 'dietician' | 'social_worker'

interface Patient { id, name, dob, unit? }
interface Task { id, patientId, title, category, status, assignedRole, assignee?, dueDate, notes?, createdAt }

type CreateTaskDTO = Omit<Task, 'id' | 'createdAt'>
type UpdateTaskDTO = Partial<Pick<Task, 'status' | 'assignee' | 'dueDate'>>
```

---

## Assumptions & Trade-offs

- No authentication — single staff session assumed
- Task assignment is per-role; assignee name is optional display metadata
- "Overdue" = dueDate < today AND status ≠ completed
- MSW used instead of a real Express backend — no extra server to run
- No pagination — patient list assumed small (<50)
- Completed status is terminal — cannot revert to overdue automatically
- No real-time updates — data refreshes on user action

---

## Optimistic Updates & Rollback

When a staff member updates a task status:
1. UI updates immediately (optimistic)
2. PATCH request sent in background
3. On success — cache confirmed, no visible change
4. On failure — cache rolls back to previous state, error shown to user

This is implemented in `src/hooks/useTasks.ts` using React Query's `onMutate` / `onError` / `onSettled` lifecycle.

---

## Failure Modes

| Scenario | Behaviour |
|---|---|
| Patient fetch fails | Error message shown, no crash |
| Task fetch fails | Per-patient error, other rows unaffected |
| Task update fails | Optimistic update rolled back, user notified |
| Missing optional fields (unit, assignee) | UI degrades gracefully, no crash |
| Network retry | React Query retries 3x before showing error |

---

## Extensibility

**Adding a new role (e.g. physiotherapist):**
1. Add to `StaffRole` type in `api/types.ts`
2. Add button in `FilterBar.tsx`
3. Add to mock data in `mocks/handlers.ts`
— No other files change.

**Adding a new task category:**
1. Add to `TaskCategory` type in `api/types.ts`
2. Add option in `CreateTaskModal.tsx`
— No other files change.

---

## Known Limitations & Next Steps

- No authentication or role-based access control
- No pagination for large patient lists
- No real-time updates (could add WebSocket or polling)
- Filters could be persisted in URL params for shareability
- Mobile responsiveness not fully addressed

---

## AI Usage

- Used Claude to scaffold boilerplate (folder structure, mock data, base component shells)
- Manually reviewed and adjusted all optimistic update logic and rollback behaviour
- Disagreed with AI on filter logic — AI initially marked completed+past-due tasks as overdue; corrected to treat completed as terminal regardless of date
- All TypeScript interfaces, architectural decisions, and README written with manual review