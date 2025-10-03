// On mocke d'abord les services
jest.mock('../services/auth', () => ({
  loginService: jest.fn(),
  registerUserService: jest.fn(),
  getProfileService: jest.fn(),
  updateProfileService: jest.fn(),
  deleteProfileService: jest.fn(),
  logoutService: jest.fn()
}));

const {
  loginController,
  registerUserController,
  getProfileController,
  updateProfileController,
  deleteProfileController,
  logoutController
} = require('../controllers/auth');

const {
  loginService,
  registerUserService,
  getProfileService,
  updateProfileService,
  deleteProfileService,
  logoutService
} = require('../services/auth');

// Mock de res
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Auth Controllers Integration', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('loginController', () => {
    it('returns 400 if missing credentials', async () => {
      const req = { body: {} }, res = mockRes();
      await loginController(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('returns 200 if success', async () => {
      loginService.mockResolvedValue({ id: 1, email: 'a@b.c', token: 't' });
      const req = { body: { email: 'a@b.c', password: 'pw' } }, res = mockRes();
      await loginController(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('returns 401 if service returns INVALID_PASSWORD', async () => {
      loginService.mockResolvedValue({ error: 'INVALID_PASSWORD' });
      const req = { body: { email: 'a@b.c', password: 'wrong' } }, res = mockRes();
      await loginController(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('returns 500 if service throws', async () => {
      loginService.mockImplementation(() => { throw new Error('boom'); });
      const req = { body: { email: 'a@b.c', password: 'pw' } }, res = mockRes();
      await loginController(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('registerUserController', () => {
    it('returns 400 if missing fields', async () => {
      const req = { body: {} }, res = mockRes();
      await registerUserController(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('returns 201 if success', async () => {
      registerUserService.mockResolvedValue({ id: 1, email: 'a@b.c' });
      const req = { body: { email: 'a@b.c', password: 'pw', firstName: 'A', lastName: 'B', birthDate: '2000-01-01' } }, res = mockRes();
      await registerUserController(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('returns 409 if service returns EMAIL_ALREADY_USED', async () => {
      registerUserService.mockResolvedValue({ error: 'EMAIL_ALREADY_USED' });
      const req = { body: { email: 'a@b.c', password: 'pw', firstName: 'A', lastName: 'B', birthDate: '2000-01-01' } }, res = mockRes();
      await registerUserController(req, res);
      expect(res.status).toHaveBeenCalledWith(409);
    });
  });

  describe('getProfileController', () => {
    it('returns 400 if invalid id', async () => {
      const req = { user: { userId: 'abc' } }, res = mockRes();
      await getProfileController(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('returns 200 if success', async () => {
      getProfileService.mockResolvedValue({ id: 1 });
      const req = { user: { userId: 1 } }, res = mockRes();
      await getProfileController(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('returns 404 if service returns null', async () => {
      getProfileService.mockResolvedValue(null);
      const req = { user: { userId: 1 } }, res = mockRes();
      await getProfileController(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('updateProfileController', () => {
    it('returns 400 if invalid id', async () => {
      const req = { user: { userId: 'abc' }, body: {} }, res = mockRes();
      await updateProfileController(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('returns 200 if success', async () => {
      updateProfileService.mockResolvedValue({ id: 1 });
      const req = { user: { userId: 1 }, body: { firstName: 'New' } }, res = mockRes();
      await updateProfileController(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('returns 404 if service returns null', async () => {
      updateProfileService.mockResolvedValue(null);
      const req = { user: { userId: 1 }, body: { firstName: 'New' } }, res = mockRes();
      await updateProfileController(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('deleteProfileController', () => {
    it('returns 400 if invalid id', async () => {
      const req = { user: { userId: 'abc' } }, res = mockRes();
      await deleteProfileController(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('returns 204 if success', async () => {
      deleteProfileService.mockResolvedValue(true);
      const req = { user: { userId: 1 } }, res = mockRes();
      await deleteProfileController(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it('returns 404 if service returns null', async () => {
      deleteProfileService.mockResolvedValue(null);
      const req = { user: { userId: 1 } }, res = mockRes();
      await deleteProfileController(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('logoutController', () => {
    it('returns 401 if no user', async () => {
      const req = { user: null }, res = mockRes();
      await logoutController(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('returns 200 if success', async () => {
      logoutService.mockResolvedValue(true);
      const req = { user: { userId: 1 } }, res = mockRes();
      await logoutController(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('returns 500 if service throws', async () => {
      logoutService.mockImplementation(() => { throw new Error('boom'); });
      const req = { user: { userId: 1 } }, res = mockRes();
      await logoutController(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
