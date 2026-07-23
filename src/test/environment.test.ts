import { expect, test } from 'vitest'

test('provides a browser-like test environment', () => {
  const status = document.createElement('p')
  status.textContent = 'Testing is ready'
  document.body.append(status)

  expect(status).toBeInTheDocument()

  status.remove()
})
