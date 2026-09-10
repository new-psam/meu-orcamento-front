/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },

  },
  test: {
    environment: 'jsdom', // <-- Esta é a linha mágica que resolve o erro
    globals: true,
    setupFiles: ['./src/tests/setupTests.ts'],
  },
});
