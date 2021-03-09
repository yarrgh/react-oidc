import { AuthState, Profile } from './auth-state';

type Action =
  | { type: 'INITIALIZED' | 'LOGIN_COMPLETE' | 'USER_UPDATED'; user?: Profile }
  | { type: 'LOGOUT' }
  | { type: 'ERROR'; error: Error };

const reducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case 'INITIALIZED':
    case 'LOGIN_COMPLETE':
      return {
        ...state,
        isAuthenticated: !!action.user,
        user: action.user,
        isLoading: false,
        error: undefined,
      };
    case 'USER_UPDATED':
      return {
        ...state,
        isAuthenticated: !!action.user,
        user: action.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: undefined,
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
