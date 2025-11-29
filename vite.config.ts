import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',              // muy importante si va en el root del dominio
  build: {
    outDir: 'dist',       // por defecto
  },
})