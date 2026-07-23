import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.glb'],
  // Respeita a porta atribuída pelo ambiente (ex.: preview do Claude Code).
  server: process.env.PORT ? { port: Number(process.env.PORT) } : undefined,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
