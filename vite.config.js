import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/ThreeBodyPlay/',
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})