import { User } from 'oidc-client';
import { AuthState, Profile } from './auth-state';

type Action =
  | { type: 'INITIALIZED' | 'LOGIN_COMPLETE' | 'USER_UPDATED'; user?: User }
  | { type: 'LOGOUT' }
  | { type: 'ERROR'; error: Error };

const reducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case 'INITIALIZED':
    case 'LOGIN_COMPLETE':
      return {
        ...state,
        isAuthenticated: !!action.user,
        user: action.user?.profile as Profile,
        isLoading: false,
        error: undefined,
        token: action.user?.access_token,
      };
    case 'USER_UPDATED':
      return {
        ...state,
        isAuthenticated: !!action.user,
        user: action.user?.profile as Profile,
        token: action.user?.access_token,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: undefined,
        token: undefined,
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

export default reducer;
