/* ============================================================================
   backNav.js — smart back navigation for every back button in the app.

   Plain window.history.back() walks the real browser history stack: when a
   page was opened directly (deep link, refresh in a fresh tab) or reached
   from an external app (a WhatsApp share link, for example), the previous
   entry is outside the site, so pressing back leaves the app entirely.
   react-router stores each entry's position in the tab's own stack on
   history.state.idx — idx > 0 means there is an in-app page to return to.
   When there is none, the caller's fallback route is opened instead, so a
   back press can never strand the user outside the app.
   ========================================================================== */

let navigateRef = null;

/* App.jsx hands over the router's navigate() once it mounts; the reference
   stays valid because react-router v6 returns a stable function. */
export function setBackNavigate(navigate) {
  navigateRef = navigate;
}

export function goBack(fallback = '/index/home') {
  const idx = window.history.state?.idx;
  if (typeof idx === 'number' && idx > 0) {
    window.history.back();
    return;
  }
  if (navigateRef) {
    /* No in-app history (this is the tab's first entry) — open the logical
       parent route instead of walking out of the site. */
    navigateRef(fallback);
    return;
  }
  /* Before the first effect runs the reference is not set yet; the hash
     assignment is picked up by HashRouter through popstate. */
  window.location.hash = `#${fallback}`;
}
