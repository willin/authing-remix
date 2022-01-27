import { createLogoutLoader } from '@authing/remix';
import { sessionStorage } from '~/services/session.server';
import { appDomain, logoutRedirectUri } from '~/config.server';

export const loader = createLogoutLoader({
  redirectUri: logoutRedirectUri,
  appDomain,
  sessionStorage
});
