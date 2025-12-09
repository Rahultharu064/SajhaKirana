import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/api/features': {
        target: 'https://ab.reasonlabsapi.com/api',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5003',
        changeOrigin: true,
      },
    },
  },
})
