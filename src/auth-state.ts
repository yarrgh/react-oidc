export interface Profile {
  name: string;
  email: string;
  given_name: string;
  family_name: string;
  member_number?: number;
  person_id?: number;
}

export interface AuthState {
  error?: Error;
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: Profile;
  token?: string;
}

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
};
