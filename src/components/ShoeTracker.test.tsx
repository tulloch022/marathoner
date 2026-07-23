import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import ShoeTracker from './ShoeTracker'

async function addShoe(name: string) {
  const user = userEvent.setup()

  await user.type(screen.getByPlaceholderText('Shoe Name'), name)
  await user.click(screen.getByRole('button', { name: 'Add' }))

  return user
}

describe('ShoeTracker', () => {
  it('adds a shoe with zero starting mileage', async () => {
    render(<ShoeTracker />)

    await addShoe('Daily Trainer')

    expect(screen.getByText('Daily Trainer: 0 mi')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Shoe Name')).toHaveValue('')
  })

  it('logs a run and adds its distance to the selected shoe', async () => {
    render(<ShoeTracker />)
    const user = await addShoe('Daily Trainer')

    await user.type(screen.getByPlaceholderText('Miles'), '5')
    await user.type(screen.getByPlaceholderText('Time (e.g. 45:30)'), '45:30')
    await user.selectOptions(screen.getByRole('combobox'), 'Daily Trainer')
    await user.click(screen.getByRole('button', { name: 'Log Run' }))

    expect(
      screen.getByText('5 mi in 45:30 wearing Daily Trainer')
    ).toBeInTheDocument()
    expect(screen.getByText('Daily Trainer: 5 mi')).toBeInTheDocument()
  })
})
