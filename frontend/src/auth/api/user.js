import { apiFetch } from '../../common/utils/fetcher';

/**
 * Liste les utilisateurs
 * @param {Object} params - filtres et pagination (ex: { role: 'ADMIN', limit: 10, page: 1 })
 */
export const listUsers = async (params = {}) => {
  const res = await apiFetch('/user', { params });

  // Normalisation pour Pagination
  const root = res?.data ?? res;
  const users = root?.users || (Array.isArray(root) ? root : []);

  let total =
    root?.pagination?.total ??
    root?.total ??
    root?.count;

  // Si pas de total fourni par l'API, on le déduit
  if (typeof total !== 'number') {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    if (users.length === limit) {
      // Page pleine → on suppose qu'il y a au moins un élément de plus
      total = page * limit + 1;
    } else {
      total = (page - 1) * limit + users.length;
    }
  }

  const pagination = root?.pagination || {
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    total
  };

  return { users, pagination };
};

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
