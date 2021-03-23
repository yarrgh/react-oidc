import { useContext } from 'react';
import { AuthContext, AuthContextInterface } from './auth-context';

export const useAuth = (): AuthContextInterface => useContext(AuthContext);
