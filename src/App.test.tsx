import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import AuthProvider from './auth/AuthProvider'
import {
  logOut,
  subscribeToAuthState,
  type AuthUser
} from './services/authService'

vi.mock('framer-motion', () => ({
  motion: {
    button: 'button',
    div: 'div',
    section: 'section'
  }
}))

vi.mock('./services/authService', () => ({
  logOut: vi.fn(),
  signIn: vi.fn(),
  signUp: vi.fn(),
  subscribeToAuthState: vi.fn()
}))

const mockedLogOut = vi.mocked(logOut)
const mockedSubscribeToAuthState = vi.mocked(subscribeToAuthState)
const signedInUser: AuthUser = {
  uid: 'runner-1',
  email: 'runner@example.com'
}

let emitAuthState: (user: AuthUser | null) => void
let emitAuthError: (error: Error) => void
let unsubscribe: ReturnType<typeof vi.fn>

const sectionTransitions = [
  ['Plan', 'Plan Your Workouts'],
  ['Track', 'Track Your Runs'],
  ['Analyze', 'Analyze Your Progress']
] as const

function renderApp() {
  return render(
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}

function renderSignedInApp() {
  const view = renderApp()

  act(() => {
    emitAuthState(signedInUser)
  })

  return view
}

beforeEach(() => {
  vi.clearAllMocks()
  unsubscribe = vi.fn()
  mockedLogOut.mockResolvedValue()
  mockedSubscribeToAuthState.mockImplementation((onChange, onError) => {
    emitAuthState = onChange
    emitAuthError = onError ?? (() => undefined)
    return unsubscribe
  })
})

describe('App authentication state', () => {
  it('shows loading while Firebase resolves the session and cleans up its listener', () => {
    const { unmount } = renderApp()

    expect(screen.getByRole('status')).toHaveTextContent(
      'Loading your session...'
    )
    expect(screen.queryByRole('button', { name: 'Login' })).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()

    unmount()

    expect(unsubscribe).toHaveBeenCalledOnce()
  })

  it('shows signed-out controls and gates personal training features', () => {
    renderApp()

    act(() => {
      emitAuthState(null)
    })

    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument()
    expect(
      screen.getByText(/sign in or create an account to access/i)
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('navigation', { name: 'Training sections' })
    ).not.toBeInTheDocument()
  })

  it('updates the UI when Firebase reports a signed-in session', () => {
    renderApp()

    act(() => {
      emitAuthState(null)
    })
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()

    act(() => {
      emitAuthState(signedInUser)
    })

    expect(screen.getByText('Signed in as runner@example.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Log out' })).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: 'Training sections' })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Login' })
    ).not.toBeInTheDocument()
  })

  it('returns to signed-out UI after logout', async () => {
    const user = userEvent.setup()
    renderSignedInApp()

    await user.click(screen.getByRole('button', { name: 'Log out' }))

    expect(mockedLogOut).toHaveBeenCalledOnce()

    act(() => {
      emitAuthState(null)
    })

    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
    expect(
      screen.queryByRole('navigation', { name: 'Training sections' })
    ).not.toBeInTheDocument()
  })

  it('shows a calm error when logout fails', async () => {
    const user = userEvent.setup()
    mockedLogOut.mockRejectedValue(new Error('Network unavailable'))
    renderSignedInApp()

    await user.click(screen.getByRole('button', { name: 'Log out' }))

    expect(screen.getByRole('alert')).toHaveTextContent(
      "We couldn't log you out. Please try again."
    )
  })

  it('resolves an authentication subscription error to signed-out UI', () => {
    renderApp()

    act(() => {
      emitAuthError(new Error('Unable to restore session'))
    })

    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})

describe('App training sections', () => {
  it('renders the signed-in training companion screen', () => {
    renderSignedInApp()

    expect(
      screen.getByRole('heading', { level: 1, name: 'Marathoner.' })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Welcome to your training companion')
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Plan' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Track' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Analyze' })).toBeInTheDocument()
  })

  it.each(sectionTransitions)(
    'opens and closes the %s section',
    async (sectionName, sectionHeading) => {
      const user = userEvent.setup()
      renderSignedInApp()

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
    renderSignedInApp()

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
    renderSignedInApp()

    await user.click(screen.getByRole('button', { name: 'Track' }))

    expect(
      document.querySelector(
        'button button, button input, button select, button textarea, button a[href]'
      )
    ).toBeNull()
  })
})
