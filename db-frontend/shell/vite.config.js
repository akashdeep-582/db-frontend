import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        // remotes wired here once tenant-app, owner-app, admin-app are built
      },
      shared: ['react', 'react-dom', 'react-router-dom', 'zustand'],
    }),
  ],
  server: {
    fs: { allow: ['..'] },
    proxy: {
      '^/(auth|properties|wishlists|visits|admin)': {
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
