export const clientId =
  process.env.AUTHING_CLIENT_ID || '61e4da899687d7055442f6b7';

export const clientSecret = process.env.AUTHING_CLIENT_SECRET || '';

export const appDomain =
  process.env.AUTHING_CLIENT_DOMAIN || 'https://remix.authing.cn';

export const redirectUri =
  process.env.AUTHING_REDIRECT_URI || 'http://localhost:3000/authing/callback';

export const logoutRedirectUri =
  process.env.AUTHING_LOGOUT_REDIRECT_URI || 'http://localhost:3000/';
