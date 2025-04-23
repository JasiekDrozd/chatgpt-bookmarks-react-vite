import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Dedicated config for popup
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
    // Don't use lib mode for popup, we want a proper HTML file
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html')
      },
      output: {
        // Bundle everything into a single chunk with no code splitting
        inlineDynamicImports: true,
        manualChunks: undefined,
        entryFileNames: 'popup.js',
        assetFileNames: 'popup.[ext]'
      }
    }
  }
}); 