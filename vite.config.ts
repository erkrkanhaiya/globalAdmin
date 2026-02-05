import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'vite-plugin-startup-message',
      configureServer(server) {
        let hasLogged = false
        server.httpServer?.once('listening', () => {
          setTimeout(() => {
            if (!hasLogged) {
              console.log('\n' + '='.repeat(60))
              console.log('🚀 ADMIN FRONTEND STARTED SUCCESSFULLY')
              console.log('='.repeat(60))
              console.log(`📍 Admin URL:     http://localhost:5173`)
              console.log(`🔗 Login Page:    http://localhost:5173/login`)
              console.log(`📊 Dashboard:     http://localhost:5173/dashboard`)
              console.log('='.repeat(60) + '\n')
              hasLogged = true
            }
          }, 500)
        })
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173,
    open: false,
    allowedHosts: ['admin.60yard.com']
  }
})
