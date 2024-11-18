import { atom } from 'jotai';
import type { User } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true
};

export const authStateAtom = atom<AuthState>(initialState);

export const setAuthStateAtom = atom(
  null,
  (get, set, update: Partial<AuthState>) => {
    const currentState = get(authStateAtom);
    set(authStateAtom, { ...currentState, ...update });
  }
);