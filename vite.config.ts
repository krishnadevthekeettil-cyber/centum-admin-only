
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Vercel prefers absolute base path for SPAs
  base: '/',
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json']
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    reportCompressedSize: false
  }
});
