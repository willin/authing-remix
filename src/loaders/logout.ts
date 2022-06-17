import {
  redirect,
  type LoaderFunction,
  type SessionStorage
} from '@remix-run/server-runtime';

export type LogoutLoaderArgs = {
  // such as: http://localhost:3000/
  redirectUri: string;
  // such as: https://remix.authing.cn
  appDomain: string;

  sessionStorage: SessionStorage;
};

export function createLogoutLoader({
  redirectUri,
  appDomain,
  sessionStorage
}: LogoutLoaderArgs): LoaderFunction {
  return async ({ request }): Promise<Response> => {
    const url = new URL(request.url);
    if (url.search) {
      const params = new URLSearchParams({
        redirectUri: redirectUri
      });
      return redirect(`${appDomain}/logout?${params.toString()}`);
    }
    const session = await sessionStorage.getSession(
      request.headers.get('Cookie')
    );
    return redirect(`${url.pathname}?redirect=true`, {
      headers: {
        'Set-Cookie': await sessionStorage.destroySession(session)
      }
    });
  };
}
