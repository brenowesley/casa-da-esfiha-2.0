import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
})