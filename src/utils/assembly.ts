import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export const checkAssemblyId = async (assemblyId: string): Promise<boolean> => {
  try {
    // Vérifier d'abord le cache local
    const cachedDomain = localStorage.getItem('domain');
    if (cachedDomain) {
      const domain = JSON.parse(cachedDomain);
      if (domain.assemblyId === assemblyId) {
        return true;
      }
    }

    // Si pas dans le cache, vérifier Firestore
    const domainsRef = collection(db, 'domains');
    const q = query(domainsRef, where('assemblyId', '==', assemblyId));
    
    try {
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      // Si erreur de permission, considérer que l'assemblée n'existe pas
      console.warn('Unable to check Firestore, falling back to local check only');
      return false;
    }
  } catch (error) {
    console.error('Error checking assembly ID:', error);
    return false;
  }
};

export const sendApprovalEmail = async (adminEmail: string, userEmail: string, assemblyId: string) => {
  try {
    // En production, utilisez un service d'email réel
    console.log(`
      À: ${adminEmail}
      Sujet: Nouvelle demande d'accès à l'assemblée
      
      Un nouvel utilisateur (${userEmail}) demande l'accès à l'assemblée ${assemblyId}.
      
      Pour approuver ou refuser cette demande, connectez-vous à votre compte administrateur.
    `);
    
    alert("Email de demande d'approbation envoyé à l'administrateur (simulation)");
  } catch (error) {
    console.error('Error sending approval email:', error);
    throw new Error('Erreur lors de l\'envoi de l\'email d\'approbation');
  }
};