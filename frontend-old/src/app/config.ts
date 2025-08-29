// src/app/config.ts
// Centralisation des variables d'environnement de l'application

export const CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Billetterie JO',
  // Ajoute ici d'autres variables globales si besoin
  // Exemple :
  // FEATURE_X_ENABLED: import.meta.env.VITE_FEATURE_X === 'true',
} as const;

export type Config = typeof CONFIG;
