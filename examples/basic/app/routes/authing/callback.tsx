import { createCallbackLoader } from '@authing/remix';
import { sessionStorage } from '~/services/session.server';

export const loader = createCallbackLoader({
  appDomain: 'https://remix.authing.cn',
  clientId: '61dcec7e3f318cc9804acdf5',
  clientSecret: '3cb6651cf2fd2d0791cacbbba17681b1',
  failureRedirect: '/login',
  successRedirect: '/',
  sessionStorage
});
