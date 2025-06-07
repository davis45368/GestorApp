import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    port: 5050,
    strictPort: true,
    cors: true,
    host: '0.0.0.0',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./assets"),
      "@domain": `${path.resolve(__dirname, './src/domain')}`,
      "@context": `${path.resolve(__dirname, './src/context')}`,
      "@hooks": `${path.resolve(__dirname, './src/hooks')}`,
      "@routes": `${path.resolve(__dirname, "./src/UI/Routes")}`,
      "@layouts": `${path.resolve(__dirname, "./src/UI/Layouts")}`,
      "@components": `${path.resolve(__dirname, "./src/UI/Components")}`
    }
  }
})
