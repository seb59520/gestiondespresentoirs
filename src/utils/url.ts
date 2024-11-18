export const getPublicDisplayUrl = (displayId: string): string => {
  // En développement, utiliser l'URL complète avec le port 5173
  const baseUrl = import.meta.env.DEV
    ? window.location.origin
    : import.meta.env.VITE_PUBLIC_URL || window.location.origin;
  
  return `${baseUrl}/public/displays/${displayId}`;
};