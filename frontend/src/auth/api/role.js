import { apiFetch } from '../../common/utils/fetcher';

/**
 * Met à jour le rôle d’un utilisateur
 * @param {number|string} id - ID de l'utilisateur
 * @param {string} role - Nouveau rôle ('USER', 'ADMIN', 'AGENT', etc.)
 */
export const updateRole = (id, role) =>
  apiFetch(`/role/${id}`, { method: 'PUT', body: { role } });
