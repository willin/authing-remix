import { createLoginLoader } from '@authing/remix';
import { appDomain, clientId, redirectUri } from '~/config.server';

export const loader = createLoginLoader({
  appDomain,
  clientId,
  redirectUri,
  scope: 'openid roles username phone profile'
});
