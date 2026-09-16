import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { get } from '../lib/authSession.js';

/* Route guard — renders the nested routes only when a session (access token)
   exists; otherwise it redirects to the login page and remembers where the
   user was headed so login can send them back there. */
export default function RequireAuth() {
  const location = useLocation();
  const { access } = get();

  if (!access) {
    return <Navigate to="/index/auth/login" replace state={{ from: location.pathname + location.search }} />;
  }

  return <Outlet />;
}
