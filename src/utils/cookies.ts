import Cookie from 'js-cookie';
import cookie from 'cookie';
import { IncomingMessage } from 'http';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

export function parseCookie(
  req: IncomingMessage & { cookies: NextApiRequestCookies }
) {
  if (!req || !req.headers) {
    return {};
  }

  return cookie.parse(req.headers.cookie || '');
}

export function setCookie(key: string, value: string) {
  const nodeEnv = process.env.NODE_ENV === 'production';

  Cookie.set(key, value, {
    secure: nodeEnv || false,
  });
}

export function destroyCookie() {
  Cookie.remove('nextauth.token');
  Cookie.remove('nextauth.user');
}
