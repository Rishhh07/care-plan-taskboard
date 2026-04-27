import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from '../components/ui/StatusBadge'

describe('StatusBadge', () => {
  it('renders Overdue label for overdue status', () => {
    render(<StatusBadge status="overdue" />)
    expect(screen.getByText('Overdue')).toBeInTheDocument()
  })

  it('renders Completed label for completed status', () => {
    render(<StatusBadge status="completed" />)
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('renders In Progress label for in_progress status', () => {
    render(<StatusBadge status="in_progress" />)
    expect(screen.getByText('In Progress')).toBeInTheDocument()
  })
})