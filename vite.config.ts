import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Get port from environment or use default
const PORT = parseInt(process.env.PORT || process.env.VITE_PORT || '3000', 10)
const PRODUCT = process.env.PRODUCT || 'all'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: PORT,
    host: true,
    open: PRODUCT !== 'all' ? `/${PRODUCT}/login` : '/login',
  },
  // SPA fallback - serve index.html for all routes
  appType: 'spa',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
