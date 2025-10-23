import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  test: {
    globals: true,
    environment: 'jsdom',
    
    // ✅ CORRECCIÓN 1: Apuntamos a la carpeta 'test' (minúscula)
    setupFiles: './src/test/setupTests.ts', 
    
    // ✅ CORRECCIÓN 2: Apuntamos a 'test' (minúscula)
    // y hacemos el patrón más flexible para que encuentre tanto .test.tsx como .Test.tsx
    include: ['src/test/**/*.{test,Test,spec,Spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  }
})