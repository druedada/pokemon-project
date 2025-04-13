import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  server: {
    fs: {
      strict: false
    }
  },
  assetsInclude: ['**/*.json'],
  css: {
    preprocessorOptions: {
      css: {
        charset: false
      }
    }
  },
  build: {
    sourcemap: true
  }
})
