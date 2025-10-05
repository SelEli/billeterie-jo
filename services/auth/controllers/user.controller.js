const { makeController } = require('./core.controller');
const {
  createUserService,
  deleteUserService,
  listUsersService,
  readUserService,
  updateUserService
} = require('../services/user.service');

const userController = {
  createUser: makeController({
    name: 'createUser',
    validate: (req) => {
      if (req.user?.role !== 'ADMIN') return 'FORBIDDEN';
    },
    service: (req) => createUserService(req.body),
    successType: 'CREATE_USER',
    successMsg: 'User created successfully',
    successCode: 201
  }),

  deleteUser: makeController({
    name: 'deleteUser',
    validate: (req) => {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) return 'INVALID_USER_ID';
    },
    service: (req) => deleteUserService(Number(req.params.id)),
    successType: 'DELETE_USER',
    successMsg: 'User deleted successfully',
    successCode: 204
  }),

  listUsers: makeController({
    name: 'listUsers',
    validate: (req) => {
      if (req.query?.limit && isNaN(Number(req.query.limit))) {
        return 'INVALID_QUERY_LIMIT';
      }
    },
    service: (req) => listUsersService(req.query),
    successType: 'READ_LIST',
    successMsg: 'Users retrieved successfully'
  }),

  readUser: makeController({
    name: 'readUser',
    validate: (req) => {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) return 'INVALID_USER_ID';
    },
    service: (req) => readUserService(Number(req.params.id)),
    successType: 'READ_ONE',
    successMsg: 'User retrieved successfully'
  }),

  updateUser: makeController({
    name: 'updateUser',
    validate: (req) => {
      if (req.user?.role !== 'ADMIN') return 'FORBIDDEN';
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) return 'INVALID_USER_ID';
    },
    service: (req) => updateUserService(Number(req.params.id), req.body),
    successType: 'UPDATE_USER',
    successMsg: 'User updated successfully'
  })
};

// ✅ Mapping pour les routes
module.exports = {
  createUserController: userController.createUser,
  deleteUserController: userController.deleteUser,
  listUsersController: userController.listUsers,
  readUserController: userController.readUser,
  updateUserController: userController.updateUser
};
