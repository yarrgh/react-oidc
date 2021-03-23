import { User } from 'oidc-client';
import { AuthState, Profile } from './auth-state';

type Action =
  | {
      type: 'INITIALIZED' | 'LOGIN_COMPLETE' | 'USER_UPDATED';
      user: User | null;
    }
  | { type: 'LOGOUT' }
  | { type: 'ERROR'; error: Error };

export const reducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case 'INITIALIZED':
    case 'LOGIN_COMPLETE':
      return {
        ...state,
        isAuthenticated: !!action.user && !action.user.expired,
        user: action.user?.profile as Profile,
        isLoading: false,
        error: null,
        token: action.user?.access_token ?? null,
      };
    case 'USER_UPDATED':
      return {
        ...state,
        isAuthenticated: !!action.user && !action.user.expired,
        user: action.user?.profile as Profile,
        token: action.user?.access_token ?? null,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case 'ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    default:
      return state;
  }
};
