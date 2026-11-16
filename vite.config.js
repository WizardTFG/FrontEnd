import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],

  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,

    watch: {
      usePolling: true,
      interval: 300,
    },

    hmr: {
      host: 'localhost',
      clientPort: 5173,
    },
  },

  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
})