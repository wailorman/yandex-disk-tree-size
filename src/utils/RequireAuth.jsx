import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect';
import { isAuthenticated } from '../selectors/user-selectors';

export const RequireAuth = connectedRouterRedirect({
  redirectPath: '/auth',
  authenticatedSelector: isAuthenticated,
});

export default RequireAuth;
