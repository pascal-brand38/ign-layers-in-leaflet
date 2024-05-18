import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/ign-layers-in-leaflet/',   // https://dev.to/shashannkbawa/deploying-vite-app-to-github-pages-3ane
  plugins: [react()],
})
