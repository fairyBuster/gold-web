import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

/* One-time URL migration: routing is hash-based (#/index/auth/login), so the
   part before the '#' is always '/'. Links saved the old way (bookmarks,
   referral links, stale tabs) would otherwise land on the Welcome redirect —
   rewrite them into the hash form before the router mounts. replaceState()
   swaps the URL without a reload and without growing the history stack. */
const OLD_PATH = /^\/(index|auth|home|assets|rewards|transactions|profil|affiliate|berita|support|landing|sitemap)(\/|$)/;

if (!window.location.hash && OLD_PATH.test(window.location.pathname)) {
  window.history.replaceState(null, '', `/#${window.location.pathname}${window.location.search}`);
}

createRoot(document.getElementById('root')).render(<App />);
