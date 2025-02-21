import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: [
        'node:fs', 
        'node:path', 
        'node:url',
        /node:.*/,
        'playwright',
        '@axe-core/playwright',
        'debug',
        'util',
        'chalk',
        'jsdom',
        'axe-core',
        'glob'
      ],
      output: {
        format: 'es',
        generatedCode: 'es2015',
        compact: true,
        minifyInternalExports: true
      }
    },
    target: 'node18',
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  }
})