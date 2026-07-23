import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/marathoner/',
  plugins: [react()],
  assetsInclude: ['src/assets/IMG_0437.JPG'],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts'
  }
})
