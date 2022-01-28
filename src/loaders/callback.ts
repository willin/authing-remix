import {
  redirect,
  type LoaderFunction,
  type SessionStorage
} from '@remix-run/server-runtime';

export type CallbackLoaderArgs = {
  // such as: https://remix.authing.cn
  appDomain: string;
  // such as: 61dcecxxxx318xxxx04acdf5
  clientId: string;
  // such as: 3xx66xxxx2fdxxxx91caxxxxa1xxxxb1
  clientSecret: string;
  sessionStorage: SessionStorage;

  // such as: /login
  failureRedirect?: string;
  // such as: /
  successRedirect?: string;
};

export type OidcResponse = {
  error?: string;
  error_description?: string;

  access_token: string;
  expires_in: number;
  id_token: string;
  scope: string;
  token_type: string;
};

export function createCallbackLoader({
  appDomain,
  clientId,
  clientSecret,
  failureRedirect,
  sessionStorage,
  successRedirect
}: CallbackLoaderArgs): LoaderFunction {
  return async ({ request }): Promise<Response> => {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    if (code === null) {
      return redirect(failureRedirect ?? '/login');
    }
    const body = {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code
    };
    const formBody = [];
    // eslint-disable-next-line
    for (const property in body) {
      const encodedKey = encodeURIComponent(property);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const encodedValue = encodeURIComponent(body[property]);
      formBody.push(`${encodedKey}=${encodedValue}`);
    }
    const res = await fetch(`${appDomain}/oidc/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody.join('&')
    });
    const oidcToken = (await res.json()) as OidcResponse;
    if (oidcToken.error) {
      console.error(oidcToken);
      return redirect(failureRedirect ?? '/login');
    }
    const resInfo = await fetch(
      `${appDomain}/oidc/me?access_token=${oidcToken.access_token}`
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user = await resInfo.json();
    const session = await sessionStorage.getSession(
      request.headers.get('Cookie')
    );
    console.error('Callback User', user);
    session.set('user', JSON.stringify(user));
    console.error('Callback Token', oidcToken);
    session.set('oidc', oidcToken);

    return redirect(successRedirect ?? '/', {
      headers: { 'Set-Cookie': await sessionStorage.commitSession(session) }
    });
  };
}
