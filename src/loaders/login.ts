import { redirect, type LoaderFunction } from '@remix-run/server-runtime';

export type LoginLoaderArgs = {
  // such as: https://remix.authing.cn
  appDomain: string;
  // such as: 61dcecxxxx318xxxx04acdf5
  clientId: string;
  // such as: http://localhost:3000/authing/callback
  redirectUri: string;
  // ref: https://docs.authing.cn/v2/apn/test-oidc/get-oidc-parameter/step2.html
  scope: string;
};

export function createLoginLoader({
  appDomain,
  clientId,
  redirectUri,
  scope
}: LoginLoaderArgs): LoaderFunction {
  return (): Response => {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope,
      response_type: 'code',
      nonce: `${new Date().getTime()}`
    });
    const url = `${appDomain}/oidc/auth?${params.toString()}`;
    return redirect(url);
  };
}
