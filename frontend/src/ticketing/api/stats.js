// src/ticketing/api/stats.js
import { apiFetch } from '../../common/utils/fetcher';

// Récupération des statistiques globales
export const getStats = (options = {}) => {
  return apiFetch('/stats', { method: 'GET', ...options });
};
