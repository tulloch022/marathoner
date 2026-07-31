import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

// Keep these tests focused on App state instead of animation timing.
vi.mock('framer-motion', () => ({
  motion: {
    button: 'button',
    div: 'div',
    section: 'section'
  }
}))

vi.mock('./services/authService', () => ({
  signIn: vi.fn(),
  signUp: vi.fn()
}))

const sectionTransitions = [
  ['Plan', 'Plan Your Workouts'],
  ['Track', 'Track Your Runs'],
  ['Analyze', 'Analyze Your Progress']
] as const

describe('App', () => {
  it('renders the initial training companion screen', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Marathoner.' })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Welcome to your training companion')
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Plan' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Track' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Analyze' })).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: 'Training sections' })
    ).toBeInTheDocument()
  })

  it.each(sectionTransitions)(
    'opens and closes the %s section',
    async (sectionName, sectionHeading) => {
      const user = userEvent.setup()
      render(<App />)

      const sectionTrigger = screen.getByRole('button', { name: sectionName })
      await user.click(sectionTrigger)

      expect(
        screen.getByRole('heading', { level: 1, name: sectionHeading })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('region', { name: sectionHeading })
      ).toBeInTheDocument()
      expect(
        screen.queryByRole('heading', { level: 1, name: 'Marathoner.' })
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('navigation', { name: 'Training sections' })
      ).not.toBeInTheDocument()

      const closeButton = screen.getByRole('button', {
        name: `Close ${sectionHeading} panel`
      })
      expect(closeButton).toHaveFocus()
      await user.click(closeButton)

      expect(
        screen.getByRole('heading', { level: 1, name: 'Marathoner.' })
      ).toBeInTheDocument()
      expect(
        screen.queryByRole('heading', { level: 1, name: sectionHeading })
      ).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: sectionName })).toHaveFocus()
    }
  )

  it('opens and closes a section with the keyboard', async () => {
    const user = userEvent.setup()
    render(<App />)

    const planTrigger = screen.getByRole('button', { name: 'Plan' })
    planTrigger.focus()

    await user.keyboard('{Enter}')

    expect(
      screen.getByRole('region', { name: 'Plan Your Workouts' })
    ).toBeInTheDocument()

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('region')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Plan' })).toHaveFocus()
  })

  it('keeps panel controls outside the section trigger buttons', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Track' }))

    expect(
      document.querySelector(
        'button button, button input, button select, button textarea, button a[href]'
      )
    ).toBeNull()
  })
})
