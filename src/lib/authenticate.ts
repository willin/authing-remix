import { redirect, type SessionStorage } from '@remix-run/server-runtime';
import { AuthorizationError } from './error';

function JSONparse<T = any>(str: string): T | null {
  try {
    return JSON.parse(str) as T;
  } catch (e) {
    return null;
  }
}

export type IsAuthenticatedOptions = {
  failureRedirect?: string;
  successRedirect?: string;
  throwOnError?: boolean;
};

export async function isAuthenticated<User = any>(
  request: Request,
  sessionStorage: SessionStorage,
  options: IsAuthenticatedOptions = {}
): Promise<User> {
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie')
  );
  const user = JSONparse<User>(session.get('user') as string);
  if (!user) {
    if (options.failureRedirect) {
      throw redirect(options.failureRedirect);
    } else if (options.throwOnError) {
      throw new AuthorizationError('Not authenticated');
    }
  } else if (options.successRedirect) {
    throw redirect(options.successRedirect);
  }

  return user!;
}
