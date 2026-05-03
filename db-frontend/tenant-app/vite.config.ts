import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'tenantApp',
      filename: 'remoteEntry.js',
      exposes: { './TenantApp': './src/TenantApp' },
      shared: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
    }),
  ],
  server: { port: 3003, fs: { allow: ['..'] } },
  optimizeDeps: { exclude: ['@dropbroker/ui'] },
  build: { target: 'esnext' },
})
