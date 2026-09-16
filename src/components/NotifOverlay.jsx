import { useEffect } from 'react';
import NotifCard from './NotifCard.jsx';
import { dismissNotif, useNotif } from '../lib/useShowNotif.js';

/* Styles are kept inline in this file so the component is a single-file import. */
const styles = `
.notif-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1100; /* above BottomNav (100) and ModalKonfirmasi (1000) */
  display: flex;
  justify-content: center;
  padding: 12px 16px 0;
  pointer-events: none;
}

.notif-overlay .notif-overlay-inner {
  width: 100%;
  max-width: 480px; /* matches the app's desktop content column */
  pointer-events: auto;
  animation: notif-overlay-drop 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes notif-overlay-drop {
  from {
    opacity: 0;
    transform: translateY(-14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

/* Auto-dismiss keeps the card from covering the page indefinitely; the X
   button still closes it immediately. A new notification restarts the timer. */
const AUTO_DISMISS_MS = 4000;

/**
 * Single floating host for in-app notifications (toast/banner style). Mounted
 * once in App.jsx so it survives route changes; pages trigger it through
 * useShowNotif() and the user stays on the current route.
 */
export default function NotifOverlay() {
  const notif = useNotif();

  useEffect(() => {
    if (!notif) return undefined;
    const timer = setTimeout(dismissNotif, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [notif]);

  if (!notif) return null;

  return (
    <>
      <style>{styles}</style>
      <div className="notif-overlay" role="alert" aria-live="assertive">
        {/* key re-runs the drop-in animation when one notif replaces another */}
        <div className="notif-overlay-inner" key={notif.id}>
          <NotifCard
            variant={notif.variant}
            title={notif.title}
            description={notif.description}
            onClose={dismissNotif}
          />
        </div>
      </div>
    </>
  );
}
