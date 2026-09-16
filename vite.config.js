import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/* The browser only ever calls this server's own /api/* paths; the dev and
   preview servers proxy them to the real backend (BACKEND_ORIGIN in .env).
   That variable has no VITE_ prefix on purpose — Vite must never inline it
   into the client bundle, so visitors never see the backend domain. */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendOrigin = String(process.env.BACKEND_ORIGIN || env.BACKEND_ORIGIN || '').replace(
    /\/+$/,
    ''
  );
  if (!backendOrigin) {
    console.warn('[vite] BACKEND_ORIGIN is not set in .env — /api/* requests will not be proxied.');
  }

  /* /api (data) and /media (backend-stored images) are served by the backend;
     both are proxied so the browser only ever talks to this app's own origin. */
  const proxy = backendOrigin
    ? {
        '/api': { target: backendOrigin, changeOrigin: true, secure: true },
        '/media': { target: backendOrigin, changeOrigin: true, secure: true },
      }
    : undefined;

  return {
    plugins: [react()],
    server: {
      port: 5173,
      open: false,
      // Hosts allowed to access the dev server (the leading dot also allows
      // every subdomain of scagerwebsite.uk).
      allowedHosts: ['jelajahemasind.vip', 'jelajahemas.com'],
      proxy,
    },
    /* `npm run start` serves the built app via vite preview, so it needs the
       same proxy — otherwise /api/* would fall back to the SPA index.html. */
    preview: {
      proxy,
    },
    build: {
      chunkSizeWarningLimit: 2000,
    },
  };
});
