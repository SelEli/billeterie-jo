const { makeController } = require('./core.controller');
const {
  createRoleService,
  deleteRoleService,
  getRoleService,
  listRolesService,
  updateRoleService
} = require('../services/role.service');

const roleController = {
  createRole: makeController({
    name: 'createRole',
    validate: (req) => {
      const { userId, role } = req.body;
      if (!userId || !Number.isInteger(Number(userId)) || Number(userId) <= 0) {
        return 'INVALID_ROLE_ID';
      }
      if (!role || typeof role !== 'string' || !role.trim()) {
        return 'ROLE_REQUIRED';
      }
    },
    service: (req) => createRoleService(req.body),
    successType: 'CREATE_ROLE',
    successMsg: 'Role assigned successfully',
    successCode: 201
  }),

  deleteRole: makeController({
    name: 'deleteRole',
    validate: (req) => {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) return 'INVALID_ROLE_ID';
    },
    service: (req) => deleteRoleService(Number(req.params.id)),
    successType: 'DELETE_ROLE',
    successMsg: 'Role reset to VISITOR'
  }),

  getRole: makeController({
    name: 'getRole',
    validate: (req) => {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) return 'INVALID_ROLE_ID';
    },
    service: (req) => getRoleService(Number(req.params.id)),
    successType: 'READ_ROLE',
    successMsg: 'Role retrieved successfully'
  }),

  listRoles: makeController({
    name: 'listRoles',
    service: () => listRolesService(),
    successType: 'READ_ROLE_LIST',
    successMsg: 'Roles retrieved successfully'
  }),

  updateRole: makeController({
    name: 'updateRole',
    validate: (req) => {
      if (req.user?.role !== 'ADMIN') return 'FORBIDDEN';
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) return 'INVALID_ROLE_ID';

      const roleValue = req.body?.role ?? req.body?.name;
      if (!roleValue) return 'ROLE_REQUIRED';

      const validRoles = ['ADMIN', 'AGENT', 'USER', 'VISITOR', 'EMPLOYEE'];
      if (typeof roleValue === 'string' && !validRoles.includes(roleValue.toUpperCase())) {
        return 'INVALID_ROLE';
      }
    },
    service: (req) => {
      const roleValue = req.body?.role ?? req.body?.name;
      return updateRoleService(Number(req.params.id), roleValue);
    },
    successType: 'UPDATE_ROLE',
    successMsg: 'Role updated successfully'
  })
};

// ✅ Mapping pour les routes
module.exports = {
  createRoleController: roleController.createRole,
  deleteRoleController: roleController.deleteRole,
  getRoleController: roleController.getRole,
  listRolesController: roleController.listRoles,
  updateRoleController: roleController.updateRole
};
