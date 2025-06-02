import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    base: mode === 'production' ? '/fxd-partner-app/' : '/',
    build: {
      outDir: 'dist',
    },
    define: {
      'process.env': env,
    },
  }
})
