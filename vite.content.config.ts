import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Dedicated config for content script
// This builds a completely self-contained bundle with no imports
export default defineConfig({
  plugins: [react()],
  define: {
    // Provide polyfill for process.env in browser environment
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
    }
  },
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/contentScript.tsx'),
      name: 'ContentScript',
      fileName: 'content',
      formats: ['iife'] // Immediately Invoked Function Expression - all in one file
    },
    rollupOptions: {
      // Make sure to bundle all dependencies into the file
      external: [],
      output: {
        // Don't split into chunks
        inlineDynamicImports: true,
        manualChunks: undefined,
        // Format as IIFE (Immediately Invoked Function Expression)
        format: 'iife',
        // Use a standard file name
        entryFileNames: 'content.js',
        // Don't use content hashes
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  }
}); 