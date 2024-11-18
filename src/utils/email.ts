import type { Domain, Poster, Publication, Display } from '../types';

interface InitializationSummary {
  email: string;
  domain: Domain;
  posters: Partial<Poster>[];
  publications: Partial<Publication>[];
  displays: Partial<Display>[];
}

export const sendInitializationSummary = async (data: InitializationSummary) => {
  try {
    // En production, ceci enverrait un véritable email via un service comme SendGrid
    const emailContent = `
      Bonjour,

      Votre assemblée "${data.domain.name}" a été créée avec succès !

      Récapitulatif de votre configuration :

      Assemblée :
      - Nom: ${data.domain.name}
      - Adresse: ${data.domain.address}
      - Ville: ${data.domain.city} (${data.domain.postalCode})

      Vous pouvez maintenant vous connecter et commencer à configurer votre espace :
      - Ajouter des présentoirs
      - Créer des affiches
      - Gérer vos publications

      Pour toute question, n'hésitez pas à contacter notre support.

      Cordialement,
      L'équipe Gest'Prez
    `;

    // Simuler l'envoi d'email pour la démo
    console.log('Email envoyé:', emailContent);
    alert('Un email de confirmation a été envoyé à votre adresse.');

    // En production, utilisez un service d'email réel
    // await sendEmail(data.email, 'Bienvenue sur Gest\'Prez', emailContent);
  } catch (error) {
    console.error('Error sending initialization email:', error);
    throw new Error('Erreur lors de l\'envoi de l\'email de confirmation');
  }
};