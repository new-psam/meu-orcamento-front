/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // <-- Esta é a linha mágica que resolve o erro
    globals: true,
    setupFiles: ['./src/tests/setupTests.ts'],
  }
});
