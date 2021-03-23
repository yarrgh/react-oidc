import { UserManager, UserManagerSettings } from 'oidc-client';
import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useReducer,
} from 'react';
import { AuthContext } from './auth-context';
import { initialAuthState } from './auth-state';
import { reducer } from './reducer';
import { hasAuthParams } from './utils';

export type OidcState = {
  returnTo?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

const defaultOnRedirectCallback = (appState?: OidcState): void => {
  window.history.replaceState(
    {},
    document.title,
    appState?.returnTo || window.location.pathname
  );
};

let client: UserManager = null!;

export async function getAccessToken(): Promise<string | null> {
  return (await client?.getUser())?.access_token || null;
}

export interface AuthProviderOptions {
  onRedirectCallback?: (appState: OidcState) => void;
  userManagerOptions: UserManagerSettings;
}

export const AuthProvider: FC<AuthProviderOptions> = ({
  children,
  onRedirectCallback = defaultOnRedirectCallback,
  userManagerOptions,
}: PropsWithChildren<AuthProviderOptions>) => {
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  useEffect(() => {
    client = new UserManager(userManagerOptions);
  }, [userManagerOptions]);

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        if (hasAuthParams()) {
          const user = await client.signinRedirectCallback();
          onRedirectCallback(user.state);
        }

        const user = await client.getUser();
        dispatch({ type: 'INITIALIZED', user });
      } catch (error) {
        dispatch({ type: 'ERROR', error });
      }
    })();
  }, [onRedirectCallback]);

  const signInRedirect = useCallback(async (url = '/') => {
    const oidcState: OidcState = {
      returnTo: url,
    };
    await client.signinRedirect({ state: oidcState });
  }, []);

  const signInRedirectCallback = useCallback(async () => {
    const user = await client.signinRedirectCallback();
    dispatch({ type: 'LOGIN_COMPLETE', user });
    const oidcState: OidcState = user?.state ?? {};
    onRedirectCallback(oidcState);
  }, [onRedirectCallback]);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
    client.clearStaleState();
    client.removeUser();
    client.signoutRedirect();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signInRedirect,
        signInRedirectCallback,
        signOutRedirect: logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
