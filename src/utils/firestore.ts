import { 
  collection, 
  doc,
  getDoc,
  setDoc,
  query,
  where,
  getDocs,
  FirestoreError,
  enableNetwork,
  disableNetwork,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { User, Domain } from '../types';

// Network status management
export const goOnline = async () => {
  try {
    await enableNetwork(db);
    console.log('Firestore network enabled');
  } catch (error) {
    console.error('Failed to enable Firestore network:', error);
    throw error;
  }
};

export const goOffline = async () => {
  try {
    await disableNetwork(db);
    console.log('Firestore network disabled');
  } catch (error) {
    console.error('Failed to disable Firestore network:', error);
    throw error;
  }
};

export const createUser = async (user: User): Promise<User> => {
  try {
    const userRef = doc(db, 'users', user.id);
    await setDoc(userRef, {
      ...user,
      createdAt: serverTimestamp()
    });
    return user;
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
};

export const createDomain = async (domain: Domain): Promise<Domain> => {
  try {
    // Vérifier si l'utilisateur est connecté
    const userId = domain.ownerId;
    if (!userId) {
      throw new Error('User must be authenticated to create a domain');
    }

    // Créer un nouveau document avec un ID auto-généré
    const domainRef = doc(collection(db, 'domains'));
    
    // Ajouter les métadonnées
    const domainWithMetadata = {
      ...domain,
      id: domainRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Sauvegarder le document
    await setDoc(domainRef, domainWithMetadata);

    // Retourner le domaine avec l'ID généré
    return {
      ...domainWithMetadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to create domain:', error);
    throw error;
  }
};

export const getUser = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() as User : null;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
};

export const getDomain = async (domainId: string): Promise<Domain | null> => {
  try {
    const domainDoc = await getDoc(doc(db, 'domains', domainId));
    return domainDoc.exists() ? domainDoc.data() as Domain : null;
  } catch (error) {
    console.error('Failed to fetch domain:', error);
    throw error;
  }
};

export const getDomainByAssemblyId = async (assemblyId: string): Promise<Domain | null> => {
  try {
    const domainsRef = collection(db, 'domains');
    const q = query(domainsRef, where('assemblyId', '==', assemblyId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }

    return querySnapshot.docs[0].data() as Domain;
  } catch (error) {
    console.error('Failed to fetch domain by assembly ID:', error);
    throw error;
  }
};