import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  base: './', // Add this line to make assets work with relative paths
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  assetsInclude: ['**/*.json'],
  server: {
    fs: {
      strict: false
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
