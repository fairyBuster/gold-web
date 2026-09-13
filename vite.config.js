import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
    // Hosts allowed to access the dev server (the leading dot also allows
    // every subdomain of scagerwebsite.uk).
    allowedHosts: ['frontend.scagerwebsite.uk', '.scagerwebsite.uk'],
  },
  build: {
    chunkSizeWarningLimit: 2000,
  },
});
