import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  fetchSignInMethodsForEmail,
  AuthError
} from 'firebase/auth';
import { auth } from './firebase';
import { createUser, getUser } from './firestore';
import type { User } from '../types';

const handleAuthError = (error: AuthError | Error) => {
  console.error('Auth error:', error);

  if (error instanceof Error && !('code' in error)) {
    throw error;
  }

  const firebaseError = error as AuthError;
  switch (firebaseError.code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      throw new Error('Email ou mot de passe incorrect. Veuillez réessayer.');
    case 'auth/email-already-in-use':
      throw new Error('Un compte existe déjà avec cet email. Veuillez vous connecter ou utiliser une autre adresse.');
    case 'auth/network-request-failed':
      throw new Error('Problème de connexion internet. Vérifiez votre connexion et réessayez.');
    case 'auth/too-many-requests':
      throw new Error('Trop de tentatives. Veuillez réessayer dans quelques minutes.');
    case 'auth/user-disabled':
      throw new Error('Ce compte a été désactivé. Veuillez contacter le support.');
    case 'auth/operation-not-allowed':
      throw new Error('Cette opération n\'est pas autorisée. Veuillez contacter le support.');
    case 'auth/invalid-api-key':
    case 'auth/app-deleted':
    case 'auth/invalid-auth-event':
    case 'auth/invalid-tenant-id':
      throw new Error('Erreur critique de configuration. Veuillez contacter le support.');
    default:
      throw new Error('Une erreur inattendue est survenue. Veuillez réessayer.');
  }
};

export const register = async (email: string, password: string, userData: Omit<User, 'id' | 'email'>): Promise<User> => {
  try {
    // Vérifier d'abord si l'email existe déjà
    const existingUsers = await fetchSignInMethodsForEmail(auth, email);
    if (existingUsers.length > 0) {
      throw new Error('Un compte existe déjà avec cet email. Veuillez vous connecter ou utiliser une autre adresse.');
    }

    // Créer l'utilisateur dans Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Générer et stocker le code de vérification
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem(`verification_${email}`, verificationCode);
    
    // Simuler l'envoi d'email (en production, utilisez un service d'email réel)
    console.log(`Code de vérification pour ${email}: ${verificationCode}`);
    alert(`Pour la démo, voici votre code de vérification: ${verificationCode}`);

    // Créer l'utilisateur dans Firestore
    const user: User = {
      id: userCredential.user.uid,
      email,
      ...userData,
      createdAt: new Date().toISOString()
    };
    
    await createUser(user);
    
    return user;
  } catch (error) {
    handleAuthError(error as AuthError | Error);
    throw error;
  }
};

export const login = async (email: string, password: string): Promise<User | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = await getUser(userCredential.user.uid);
    
    if (user) {
      localStorage.setItem('userData', JSON.stringify(user));
      window.dispatchEvent(new CustomEvent('authStateChange', { 
        detail: { isAuthenticated: true, user } 
      }));
      return user;
    }
    return null;
  } catch (error) {
    handleAuthError(error as AuthError | Error);
    return null;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
    localStorage.removeItem('userData');
    localStorage.removeItem('domain');
    window.dispatchEvent(new CustomEvent('authStateChange', { 
      detail: { isAuthenticated: false } 
    }));
  } catch (error) {
    handleAuthError(error as AuthError | Error);
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    handleAuthError(error as AuthError | Error);
  }
};

export const cleanupAuth = () => {
  const unsubscribe = onAuthStateChanged(auth, () => {});
  return unsubscribe;
};