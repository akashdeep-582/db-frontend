import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        ownerApp: 'http://localhost:3001/assets/remoteEntry.js',
        adminApp: 'http://localhost:3002/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react-router-dom', 'zustand', '@tanstack/react-query'],
    }),
  ],
  server: {
    fs: { allow: ['..'] },
    proxy: {
      '^/api': {
        target: 'https://sh4jxvfw36.execute-api.ap-southeast-2.amazonaws.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  optimizeDeps: {
    exclude: ['@dropbroker/ui'],
  },
  build: {
    target: 'esnext',
  },
})
