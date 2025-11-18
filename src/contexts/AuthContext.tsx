import { createContext, ReactNode, useContext } from 'react';
import { useAuth } from './hooks/useAuth';

type User = {
  _id: string;
  email: string;
  password: string;
  isAdmin: boolean;
};

type SignInData = {
  email: string;
  password: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | undefined;
  signIn: (data: SignInData) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
};

type AuthProvider = {
  children: ReactNode;
};

const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: AuthProvider) {
  const { signIn, setUser, signOut, isAuthenticated, loading, user } =
    useAuth();

  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuthenticated, loading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthenticated() {
  const ctx = useContext(AuthContext);

  return ctx;
}
