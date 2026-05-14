import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

if (!process.env.VITE_LAST_UPDATED) {
  process.env.VITE_LAST_UPDATED = new Date().toISOString()
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
