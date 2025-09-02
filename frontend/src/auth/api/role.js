import { listUsers } from './user';

/**
 * Liste les rôles distincts à partir des utilisateurs
 */
export const listRoles = async (params = {}) => {
  try {
    const { users } = await listUsers(params);

    const safeUsers = Array.isArray(users) ? users : [];
    const uniqueRoles = Array.from(
      new Set(safeUsers.map(u => u.role).filter(Boolean))
    ).map(roleName => ({
      name: roleName,
      permissions: [] // à remplir si tu as l'info
    }));

    return {
      roles: uniqueRoles,
      pagination: {
        page: 1,
        limit: uniqueRoles.length,
        total: uniqueRoles.length
      }
    };
  } catch (err) {
    console.error('Erreur listRoles', err);
    return { roles: [], pagination: { page: 1, limit: 0, total: 0 } };
  }
};

/**
 * Crée un nouveau rôle
 */
export const createRole = async (data) => {
  console.warn('createRole appelé, mais aucun endpoint /role côté backend');
  return { success: false };
};

/**
 * Met à jour un rôle
 */
export const updateRole = async () => {
  console.warn('updateRole appelé, mais aucun endpoint /role côté backend');
  return { success: false };
};

/**
 * Supprime un rôle
 */
export const deleteRole = async () => {
  console.warn('deleteRole appelé, mais aucun endpoint /role côté backend');
  return { success: false };
};
