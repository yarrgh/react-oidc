import { createContext } from 'react';
import { AuthState, initialAuthState } from './auth-state';

export interface AuthContextInterface extends AuthState {
  signInRedirect: (url?: string) => Promise<void>;
  signInRedirectCallback: () => Promise<void>;
  signOutRedirect: () => void;
}

const stub = (): never => {
  throw new Error('You forgot to wrap your component in <AuthProvider>.');
};

const initialContext: AuthContextInterface = {
  ...initialAuthState,
  signInRedirect: stub,
  signInRedirectCallback: stub,
  signOutRedirect: stub,
};

export const AuthContext = createContext<AuthContextInterface>(initialContext);
