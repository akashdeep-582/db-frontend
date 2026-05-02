import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'ownerApp',
      filename: 'remoteEntry.js',
      exposes: { './OwnerApp': './src/OwnerApp' },
      shared: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
    }),
  ],
  server: { port: 3001, fs: { allow: ['..'] } },
  optimizeDeps: { exclude: ['@dropbroker/ui'] },
  build: { target: 'esnext' },
})
