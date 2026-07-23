import { render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import Analyze from './Analyze'

vi.mock('framer-motion', () => ({
  motion: {
    div: 'div'
  }
}))

it('shows the current analytics summary', () => {
  render(<Analyze />)

  expect(screen.getByText('Total Mileage')).toBeInTheDocument()
  expect(screen.getByText('42 mi')).toBeInTheDocument()
  expect(screen.getByText('Average Pace')).toBeInTheDocument()
  expect(screen.getByText('7:30 /mi')).toBeInTheDocument()
  expect(screen.getByText('Runs This Week')).toBeInTheDocument()
  expect(screen.getByText('5')).toBeInTheDocument()
})
