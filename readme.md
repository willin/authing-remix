# @authing/remix

[![npm](https://img.shields.io/npm/v/@authing/remix.svg)](https://npmjs.org/package/@authing/remix) [![npm](https://img.shields.io/npm/dt/@authing/remix.svg)](https://npmjs.org/package/@authing/remix)

[中文说明](./readme.zh.md)

Simple Authing OIDC Authentication for Remix

- [@authing/remix](#authingremix)
  - [Functions](#functions)
    - [isAuthenticated](#isauthenticated)
  - [Loader Helpers](#loader-helpers)
    - [createCallbackLoader](#createcallbackloader)
    - [createLoginLoader](#createloginloader)
    - [createLogoutLoader](#createlogoutloader)
  - [Quick Start](#quick-start)
    - [Add dependencies](#add-dependencies)
    - [Config](#config)
    - [Create SessionStorage](#create-sessionstorage)
    - [Create Login, Logout, Callback](#create-login-logout-callback)
    - [Use in router](#use-in-router)
  - [LICENSE](#license)

## Functions

### isAuthenticated

```ts
function isAuthenticated<User = any>(
  request: Request,
  sessionStorage: SessionStorage,
  options?: IsAuthenticatedOptions
): Promise<User>;

type IsAuthenticatedOptions = {
  failureRedirect?: string;
  successRedirect?: string;
  throwOnError?: boolean;
};
```

Params:

- `throwOnError`: throw error when not authenticated
- `failureRedirect`: redirect when not authenticated,such as `/login`
- `successRedirect`: redirect when authenticated, such as `/dashboard`

Return Type: `User`

## Loader Helpers

### createCallbackLoader

```ts
function createCallbackLoader({
  appDomain,
  clientId,
  clientSecret,
  failureRedirect,
  sessionStorage,
  successRedirect
}: CallbackLoaderArgs): LoaderFunction;

type CallbackLoaderArgs = {
  appDomain: string;
  clientId: string;
  clientSecret: string;
  sessionStorage: SessionStorage;
  failureRedirect: string;
  successRedirect: string;
};
```

Params:

- `appDomain`: App Domain, like: `https://your-app.authing.cn`
- `clientId`: App ID
- `clientSecret`: App Secret
- `sessionStorage`: Remix SessionStorage
  - Notice: If you are using Remix v1.1.3 or earlier, please do not use CookieSession, it may cause UTF-8 encoding parsing error
- `failureRedirect`: redirect when failed, such as `/error`
- `successRedirect`: redirect when success, such as `/dashboard`

### createLoginLoader

```ts
function createLoginLoader({
  appDomain,
  clientId,
  redirectUri,
  scope
}: LoginLoaderArgs): LoaderFunction;

type LoginLoaderArgs = {
  appDomain: string;
  ssoDomain?: string;
  clientId: string;
  redirectUri: string;
  scope: string;
};
```

Params:

- `appDomain`: App Domain, like: `https://your-app.authing.cn`
- `ssoDomain`: SSO Domain, like: `https://your-sso.authing.cn`, when set, `appDomain` will be ignored.
- `clientId`: App ID
- `redirectUri`: Callback Redirect URI (same with Authing console configuration)
- `sope`: OAuth Scope, like: `openid profile email`
  - Ref: [Documentation](https://docs.authing.cn/v2/concepts/oidc-common-questions.html#scope-%E5%8F%82%E6%95%B0%E5%AF%B9%E5%BA%94%E7%9A%84%E7%94%A8%E6%88%B7%E4%BF%A1%E6%81%AF)

### createLogoutLoader

```ts
function createLogoutLoader({
  redirectUri,
  appDomain,
  sessionStorage
}: LogoutLoaderArgs): LoaderFunction;

type LogoutLoaderArgs = {
  redirectUri: string;
  appDomain: string;
  sessionStorage: SessionStorage;
};
```

Params:

- `appDomain`: App Domain, like: `https://your-app.authing.cn`
- `redirectUri`: Logout Callback Redirect URI (same in authing console)
- `sessionStorage`: Remix SessionStorage

## Quick Start

Example project at `examples/basic`.

### Add dependencies

```bash
npm install --save @authing/remix
# or
yarn add @authing/remix
```

### Config

Placed in `app/config.server.ts` or somewhere else.

```ts
export const clientId =
  process.env.AUTHING_CLIENT_ID || '61e4da899687d7055442f6b7';
export const clientSecret = process.env.AUTHING_CLIENT_SECRET || '';
export const appDomain =
  process.env.AUTHING_CLIENT_DOMAIN || 'https://remix.authing.cn';
export const redirectUri =
  process.env.AUTHING_REDIRECT_URI || 'http://localhost:3000/authing/callback';
export const logoutRedirectUri =
  process.env.AUTHING_LOGOUT_REDIRECT_URI || 'http://localhost:3000/';
```

### Create SessionStorage

Create `app/services/session.server.ts`.

Notice: If you are using Remix v1.1.3 or earlier, please do not use CookieSession, it may cause UTF-8 encoding parsing error

### Create Login, Logout, Callback

Create `app/routes/login.tsx`:

```ts
import { createLoginLoader } from '@authing/remix';
import { appDomain, clientId, redirectUri } from '~/config.server';

export const loader = createLoginLoader({
  appDomain,
  clientId,
  redirectUri,
  scope: 'openid roles username phone profile'
});
```

Create `app/routes/logout.tsx`:

```ts
import { createLogoutLoader } from '@authing/remix';
import { sessionStorage } from '~/services/session.server';
import { appDomain, logoutRedirectUri } from '~/config.server';

export const loader = createLogoutLoader({
  redirectUri: logoutRedirectUri,
  appDomain,
  sessionStorage
});
```

Create `app/routes/authing/callback.tsx`:

```ts
import { createCallbackLoader } from '@authing/remix';
import { sessionStorage } from '~/services/session.server';
import { appDomain, clientId, clientSecret } from '~/config.server';

export const loader = createCallbackLoader({
  appDomain,
  clientId,
  clientSecret,
  // 登录失败返回登录页
  failureRedirect: '/error',
  successRedirect: '/user',
  sessionStorage
});
```

### Use in router

```ts
import { isAuthenticated } from '@authing/remix';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await isAuthenticated(request, sessionStorage);

  return json(user || {});
};

// in page component:
const user = useLoaderData();
```

## LICENSE

MIT
