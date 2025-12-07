import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api/features': {
        target: 'https://ab.reasonlabsapi.com/api',
        changeOrigin: true,
      },
    },
  },
})
