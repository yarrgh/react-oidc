import { useContext } from 'react';
import AuthContext, { AuthContextInterface } from './auth-context';

const useAuth = (): AuthContextInterface => useContext(AuthContext);

export default useAuth;
