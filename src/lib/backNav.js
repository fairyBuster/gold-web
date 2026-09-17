/* ============================================================================
   backNav.js — back buttons return to the screen's logical parent.

   Every back button passes the route of its logical parent (wizard steps to
   the previous step, detail pages to their list, root screens to /index/home).
   The destination is deterministic: the same button always lands on the same
   screen. Walking window.history instead replays the user's visit history —
   after re-entering a flow, a back press can bounce the user into the flow
   they just left. Navigating to the parent route also keeps the user inside
   the app on a deep link, refresh in a fresh tab, or external arrival.
   ========================================================================== */

let navigateRef = null;

/* App.jsx hands over the router's navigate() once it mounts; the reference
   stays valid because react-router v6 returns a stable function. */
export function setBackNavigate(navigate) {
  navigateRef = navigate;
}

export function goBack(fallback = '/index/home') {
  if (navigateRef) {
    navigateRef(fallback);
    return;
  }
  /* Before the first effect runs the reference is not set yet; the hash
     assignment is picked up by HashRouter through popstate. */
  window.location.hash = `#${fallback}`;
}
