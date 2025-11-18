import axios from 'axios';
import { NextApiRequest, NextPageContext } from 'next';
import { parseCookies } from 'nookies';

export function getAPIClient(
  ctx?:
    | Pick<NextPageContext, 'req'>
    | {
        req: NextApiRequest;
      }
    | {
        req: Request;
      }
    | null
    | undefined
) {
  const { 'nextauth.token': token } = parseCookies(ctx);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL_API_BACKEND,
  });

  if (token) {
    api.defaults.headers.common.authorization = `Bearer ${token}`;
  }

  return api;
}
