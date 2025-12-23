import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

<<<<<<< HEAD
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Isso separa as bibliotecas (vendors) do seu código
        // O navegador baixa arquivos menores em paralelo, fica muito mais rápido!
        manualChunks: {
          vendor: ['react', 'react-dom', 'framer-motion', 'lucide-react'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Aumenta o limite para não chatear, já que otimizamos
  },
=======
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
>>>>>>> f89f84f67b0cc1ab83112c742b0c62d37fea6a95
})