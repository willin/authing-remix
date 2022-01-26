import { createLoginLoader } from '@authing/remix';

export const loader = createLoginLoader({
  appDomain: 'https://remix.authing.cn',
  clientId: '61dcec7e3f318cc9804acdf5',
  redirectUri: 'http://localhost:3000/authing/callback',
  scope: 'openid profile email roles'
});
