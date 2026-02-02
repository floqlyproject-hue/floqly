import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'FloqlyWidget',
      // Neutral filename to avoid AdBlock
      fileName: 'fl-helper',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        // Single file output
        inlineDynamicImports: true,
      },
    },
    // Optimize for small bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Target modern browsers only
    target: 'es2020',
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
})
