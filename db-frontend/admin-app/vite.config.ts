import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'adminApp',
      filename: 'remoteEntry.js',
      exposes: { './AdminApp': './src/AdminApp' },
      shared: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
    }),
  ],
  server: { port: 3002, fs: { allow: ['..'] } },
  optimizeDeps: { exclude: ['@dropbroker/ui'] },
  build: { target: 'esnext' },
})
