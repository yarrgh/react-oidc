import { UserManager, UserManagerSettings } from 'oidc-client';
import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react';
import AuthContext from './auth-context';
import { initialAuthState, Profile } from './auth-state';
import reducer from './reducer';
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

export interface AuthProviderOptions {
  onRedirectCallback?: (appState: OidcState) => void;
  userManagerOptions: UserManagerSettings;
}

const AuthProvider: FC<AuthProviderOptions> = ({
  children,
  onRedirectCallback = defaultOnRedirectCallback,
  userManagerOptions,
}: PropsWithChildren<AuthProviderOptions>) => {
  const [client] = useState(new UserManager(userManagerOptions));
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        if (hasAuthParams()) {
          const user = await client.signinRedirectCallback();
          onRedirectCallback(user.state);
        }

        const user = await client.getUser();
        dispatch({ type: 'INITIALIZED', user: user.profile as Profile });
      } catch (error) {
        dispatch({ type: 'ERROR', error });
      }
    })();
  }, [client, onRedirectCallback]);

  const signInRedirect = useCallback(
    async (url = '/') => {
      const oidcState: OidcState = {
        returnTo: url,
      };
      await client.signinRedirect({ state: oidcState });
    },
    [client]
  );

  const signInRedirectCallback = useCallback(async () => {
    const user = await client.signinRedirectCallback();
    dispatch({ type: 'LOGIN_COMPLETE', user: user.profile as Profile });
    const oidcState: OidcState = user?.state ?? {};
    onRedirectCallback(oidcState);
  }, [client, onRedirectCallback]);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
    client.clearStaleState();
    client.removeUser();
    client.signoutRedirect();
  }, [client]);

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

export default AuthProvider;
