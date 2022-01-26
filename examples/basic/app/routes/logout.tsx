import { createLogoutLoader } from '@authing/remix';
import { sessionStorage } from '~/services/session.server';

export const loader = createLogoutLoader({
  redirectUri: 'http://localhost:3000/',
  appDomain: 'https://remix.authing.cn',
  sessionStorage
});
