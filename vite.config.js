import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: mode !== 'production',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('react') ||
              id.includes('scheduler') ||
              id.includes('react-router-dom')
            ) {
              return 'vendor'
            }

            if (id.includes('leaflet') || id.includes('react-leaflet')) {
              return 'ui'
            }

            if (
              id.includes('axios') ||
              id.includes('zod') ||
              id.includes('@hookform/resolvers') ||
              id.includes('react-hook-form')
            ) {
              return 'utils'
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
}))
