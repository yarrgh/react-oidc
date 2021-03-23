export interface Profile {
  name: string;
  email: string;
  given_name: string;
  family_name: string;
  member_number?: number;
  person_id?: number;
}

export interface AuthState {
  error: Error | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: Profile | null;
  token: string | null;
}

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null,
  error: null,
};
