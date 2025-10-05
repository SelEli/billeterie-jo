const { makeController } = require('./core.controller');
const {
  loginService,
  logoutService,
  registerUserService,
  updateProfileService,
  getProfileService,
  deleteProfileService
} = require('../services/auth.service');

// Contrôleurs Auth regroupés
const authController = {
  registerUser: makeController({
    name: 'registerUser',
    validate: (req) => {
      const { email, password, firstName, lastName, birthDate } = req.body || {};
      if (!email || !password || !firstName || !lastName || !birthDate) {
        return 'MISSING_REQUIRED_FIELDS';
      }
    },
    service: (req) => registerUserService(req.body),
    successType: 'CREATE_AUTH',
    successMsg: 'User registered successfully',
    successCode: 201
  }),

  loginUser: makeController({
    name: 'loginUser',
    validate: (req) => {
      const { email, password } = req.body || {};
      if (!email || !password) return 'MISSING_CREDENTIALS';
    },
    service: (req) => loginService(req.body),
    successType: 'LOGIN',
    successMsg: 'Login successful'
  }),

  logoutUser: makeController({
    name: 'logoutUser',
    validate: (req) => (!req.user?.userId ? 'UNAUTHORIZED' : null),
    service: (req) =>
      logoutService(req.user).then(() => ({ message: 'Logged out successfully' })),
    successType: 'LOGOUT',
    successMsg: 'Logged out successfully'
  }),

  getProfileUser: makeController({
    name: 'getProfileUser',
    validate: (req) => {
      const id = Number(req.user?.userId);
      if (!Number.isInteger(id) || id <= 0) return 'INVALID_USER_ID';
    },
    service: (req) => getProfileService(Number(req.user.userId)),
    successType: 'READ_ONE',
    successMsg: 'Profile retrieved successfully'
  }),

  updateProfileUser: makeController({
    name: 'updateProfileUser',
    validate: (req) => {
      const id = Number(req.user?.userId);
      if (!Number.isInteger(id) || id <= 0) return 'INVALID_USER_ID';
    },
    service: (req) => updateProfileService(Number(req.user.userId), req.body),
    successType: 'UPDATE_PROFILE',
    successMsg: 'Profile updated successfully'
  }),

  deleteProfileUser: makeController({
    name: 'deleteProfileUser',
    validate: (req) => {
      const id = Number(req.user?.userId);
      if (!Number.isInteger(id) || id <= 0) return 'INVALID_USER_ID';
    },
    service: (req) => deleteProfileService(Number(req.user.userId)),
    successType: 'DELETE',
    successMsg: 'Profile deleted successfully'
  })
};

// ✅ On mappe les bons noms attendus par les routes
module.exports = {
  registerUserController: authController.registerUser,
  loginController: authController.loginUser,
  logoutController: authController.logoutUser,
  getProfileController: authController.getProfileUser,
  updateProfileController: authController.updateProfileUser,
  deleteProfileController: authController.deleteProfileUser
};
