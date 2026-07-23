import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('./services/authService', () => ({
  signIn: vi.fn(),
  signUp: vi.fn()
}))

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
  })
})
