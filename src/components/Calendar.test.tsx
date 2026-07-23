import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Calendar from './Calendar'

describe('Calendar', () => {
  it('shows the first week and its total mileage', () => {
    render(<Calendar />)

    expect(screen.getByRole('combobox')).toHaveValue('1')
    expect(screen.getByText('Total Mileage: 18 mi')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('shows the selected training week', async () => {
    const user = userEvent.setup()
    render(<Calendar />)

    await user.selectOptions(screen.getByRole('combobox'), '2')

    expect(screen.getByRole('combobox')).toHaveValue('2')
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('14')).toBeInTheDocument()
    expect(screen.queryByText('1')).not.toBeInTheDocument()
  })

  it('opens and closes a workout detail', async () => {
    const user = userEvent.setup()
    render(<Calendar />)

    await user.click(screen.getByText('1'))

    expect(
      screen.getByRole('heading', { level: 3, name: 'Day 1 Details' })
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(
      screen.queryByRole('heading', { level: 3, name: 'Day 1 Details' })
    ).not.toBeInTheDocument()
  })
})
