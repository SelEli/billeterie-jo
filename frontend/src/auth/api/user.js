import { apiFetch } from '../../common/utils/fetcher';

/**
 * Liste les utilisateurs
 * @param {Object} params - filtres et pagination (ex: { role: 'ADMIN', limit: 10, page: 1 })
 */
export const listUsers = (params) =>
  apiFetch('/user', { params });

/**
 * Récupère un utilisateur par ID
 */
export const getUser = (id) =>
  apiFetch(`/user/${id}`);

/**
 * Crée un nouvel utilisateur (admin)
 */
export const createUser = (data) =>
  apiFetch('/user', { method: 'POST', body: data });

/**
 * Met à jour un utilisateur par ID
 */
export const updateUser = (id, data) =>
  apiFetch(`/user/${id}`, { method: 'PUT', body: data });

/**
 * Supprime un utilisateur par ID
 */
export const deleteUser = (id) =>
  apiFetch(`/user/${id}`, { method: 'DELETE' });
