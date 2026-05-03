import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

const REMOTE_URLS = {
  dev: {
    ownerApp: 'http://localhost:3001/assets/remoteEntry.js',
    adminApp: 'http://localhost:3002/assets/remoteEntry.js',
    tenantApp: 'http://localhost:3003/assets/remoteEntry.js',
  },
  prod: {
    ownerApp: 'https://d1vsdiyf7s2gaw.cloudfront.net/assets/remoteEntry.js',
    adminApp: 'https://dfbytklcu0ht8.cloudfront.net/assets/remoteEntry.js',
    tenantApp: 'https://d1ewx2zfo51gcc.cloudfront.net/assets/remoteEntry.js',
  },
}

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'
  const remotes = isProd ? REMOTE_URLS.prod : REMOTE_URLS.dev

  return {
    plugins: [
      react(),
      federation({
        name: 'shell',
        remotes,
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
  }
})
