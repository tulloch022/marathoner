import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import LoginButton from './LoginButton'
import SignUpButton from './SignUpButton'
import { signIn, signUp } from '../services/authService'

vi.mock('../services/authService', () => ({
  signIn: vi.fn(),
  signUp: vi.fn()
}))

const mockedSignIn = vi.mocked(signIn)
const mockedSignUp = vi.mocked(signUp)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('authentication forms', () => {
  it('shows a rejected login attempt without contacting Firebase', async () => {
    const user = userEvent.setup()
    mockedSignIn.mockRejectedValue(new Error('Invalid credentials'))
    render(<LoginButton />)

    await user.click(screen.getByRole('button', { name: 'Login' }))
    await user.type(
      screen.getByPlaceholderText('Username (Email)'),
      'runner@example.com'
    )
    await user.type(screen.getByPlaceholderText('Password'), 'bad-password{Enter}')

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument()
    expect(mockedSignIn).toHaveBeenCalledWith(
      'runner@example.com',
      'bad-password'
    )
  })

  it('shows a rejected signup attempt without contacting Firebase', async () => {
    const user = userEvent.setup()
    mockedSignUp.mockRejectedValue(new Error('Email already registered'))
    render(<SignUpButton />)

    await user.click(screen.getByRole('button', { name: 'Sign Up' }))
    await user.type(screen.getByPlaceholderText('Email'), 'runner@example.com')
    await user.type(screen.getByPlaceholderText('Password'), 'password{Enter}')

    expect(
      await screen.findByText('Email already registered')
    ).toBeInTheDocument()
    expect(mockedSignUp).toHaveBeenCalledWith(
      'runner@example.com',
      'password'
    )
  })
})
