# `@yarrgh/react-oidc`

[![npm version](https://badge.fury.io/js/%40yarrgh%2Freact-oidc.svg)](https://badge.fury.io/js/%40yarrgh%2Freact-oidc)

React component that preserves and restores page scroll position when the back browser button is pressed.

## Installation

`npm i @yarrgh/react-oidc`

## Example Usage

```jsx
import { AuthProvider } from '@yarrgh/react-oidc';

const baseUrl = `${window.location.protocol}//${window.location.host}`;

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider
      userManagerOptions={{
        client_id: 'my_app',
        authority: 'https://sso.example.com', // change to your authority provider
        redirect_uri: `${baseUrl}/`,
        post_logout_redirect_uri: `${baseUrl}`,
        response_type: 'code',
        scope: 'openid profile', // <-- Add/Replace with required scopes
        filterProtocolClaims: true,
        loadUserInfo: true,
        automaticSilentRenew: false,
      }}
    >
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
```

```jsx
import { useAuth } from "@yarrgh/react-oidc";

const App = () => {
  const [count, setCount] = useState(0);
  const {
    isLoading,
    isAuthenticated,
    user,
    signInRedirect,
    logout,
  } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    signInRedirect();
    return null;
  }

  const currentUser = user!;

  return (
    <div className="App">
      <p>Hello {user?.name}</p>
      <p>
        <button onClick={logout}>Logout</button>
      </p>
    </div>
  );
}

export default App;
```
