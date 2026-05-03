import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

const REMOTE_URLS = {
  dev: {
    ownerApp: 'http://localhost:3001/assets/remoteEntry.js',
    adminApp: 'http://localhost:3002/assets/remoteEntry.js',
    tenantApp: 'http://localhost:3003/assets/remoteEntry.js',
  },
  staging: {
    ownerApp: 'https://d1krxci24dtkdi.cloudfront.net/assets/remoteEntry.js',
    adminApp: 'https://d50wk6azw371y.cloudfront.net/assets/remoteEntry.js',
    tenantApp: 'https://d19zj8xdkk4nys.cloudfront.net/assets/remoteEntry.js',
  },
  prod: {
    ownerApp: 'https://d1vsdiyf7s2gaw.cloudfront.net/assets/remoteEntry.js',
    adminApp: 'https://dfbytklcu0ht8.cloudfront.net/assets/remoteEntry.js',
    tenantApp: 'https://d1ewx2zfo51gcc.cloudfront.net/assets/remoteEntry.js',
  },
}

export default defineConfig(({ mode }) => {
  const remotes = REMOTE_URLS[mode] ?? REMOTE_URLS.prod

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
