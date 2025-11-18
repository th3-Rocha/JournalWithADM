import { useState } from 'react';
import { useRouter } from 'next/router';

import { api } from '../../services/api';
import { destroyCookie, setCookie } from '../../utils/cookies';
import { errorNotify } from '../../utils/notify';

type SignInData = {
  email: string;
  password: string;
};

type User = {
  _id: string;
  email: string;
  password: string;
  isAdmin: boolean;
};

type UserResponseProps = {
  user: User;
  token: string;
};

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user;

  async function signIn({ email, password }: SignInData) {
    try {
      const response = await api.post<UserResponseProps>('/auth/login', {
        email,
        password,
      });

      const { user, token } = response.data;

      setUser(user);
      setCookie('nextauth.token', token);
      setCookie('nextauth.user', user._id);

      api.defaults.headers.common.authorization = `Bearer ${token}`;
      await router.push('/admin/home');
    } catch (error: any) {
      const err = JSON.parse(error.request.response);
      errorNotify(err.error);
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    destroyCookie();
    await router.push('/admin/login');
  }

  return { signIn, signOut, isAuthenticated, user, loading, setUser };
}
