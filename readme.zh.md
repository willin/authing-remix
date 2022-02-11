# @authing/remix

[![npm](https://img.shields.io/npm/v/@authing/remix.svg)](https://npmjs.org/package/@authing/remix) [![npm](https://img.shields.io/npm/dt/@authing/remix.svg)](https://npmjs.org/package/@authing/remix)

[English](./readme.md)

Simple Authing OIDC Authentication for Remix

- [@authing/remix](#authingremix)
  - [实用方法](#实用方法)
    - [isAuthenticated](#isauthenticated)
  - [Loader 辅助](#loader-辅助)
    - [createCallbackLoader](#createcallbackloader)
    - [createLoginLoader](#createloginloader)
    - [createLogoutLoader](#createlogoutloader)
  - [项目示例](#项目示例)
    - [安装依赖](#安装依赖)
    - [配置环境变量](#配置环境变量)
    - [创建 SessionStorage](#创建-sessionstorage)
    - [创建登录页、注销页和回调页](#创建登录页注销页和回调页)
    - [在路由中使用](#在路由中使用)
  - [LICENSE](#license)

## 实用方法

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

参数说明：

- `throwOnError`： 未登录抛出错误
- `failureRedirect`： 未登录重定向地址，如：`/login`
- `successRedirect`： 已登录重定向地址，如：`/dashboard`

返回值： `User`

## Loader 辅助

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

参数说明：

- `appDomain`： 应用域名，如： `https://your-app.authing.cn`
- `clientId`： App ID
- `clientSecret`： App Secret
- `sessionStorage`： Remix SessionStorage
  - 注意：如果是 Remix v1.1.3 及之前版本，请不要使用 CookieSession，会存在 UTF-8 编码解析错误
- `failureRedirect`： 登录失败重定向地址，如：`/error`
- `successRedirect`： 成功重定向地址，如：`/dashboard`

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

参数说明：

- `appDomain`： 应用域名，如： `https://your-app.authing.cn`
- `ssoDomain`： SSO 域名，如： `https://your-app.authing.cn`，如果设置，将会使用 SSO 登录
- `clientId`： App ID
- `redirectUri`： 登录回调 URL （需要与 Authing 控制台中配置一致）
- `sope`： 授权范围，如：`openid profile email`
  - 参考： [官方文档](https://docs.authing.cn/v2/concepts/oidc-common-questions.html#scope-%E5%8F%82%E6%95%B0%E5%AF%B9%E5%BA%94%E7%9A%84%E7%94%A8%E6%88%B7%E4%BF%A1%E6%81%AF)

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

参数说明：

- `appDomain`： 应用域名，如： `https://your-app.authing.cn`
- `redirectUri`： 登出回调 URL （非登录，也需要与 Authing 控制台中配置一致）
- `sessionStorage`： Remix Session Storage，注意点同上

## 项目示例

参考 `examples/basic` 项目。

### 安装依赖

```bash
npm install --save @authing/remix
# or
yarn add @authing/remix
```

### 配置环境变量

如 `app/config.server.ts`，或者其他地方。建议不要忽略该步骤，将用到的变量参数统一管理。

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

### 创建 SessionStorage

创建 `app/services/session.server.ts`。

注意， Remix v1.1.3 （截止目前，2022 年 2 月）及之前版本请不要使用 CookieSession，会存在 UTF-8 编码解析错误。

### 创建登录页、注销页和回调页

创建 `app/routes/login.tsx`：

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

创建 `app/routes/logout.tsx`：

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

创建 `app/routes/authing/callback.tsx`：

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

### 在路由中使用

```ts
import { isAuthenticated } from '@authing/remix';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await isAuthenticated(request, sessionStorage);

  return json(user || {});
};

// 在页面中使用
const user = useLoaderData();
```

## LICENSE

MIT
