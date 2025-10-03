const { prisma } = require('../utils');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { 
  loginService, 
  registerUserService, 
  getProfileService, 
  updateProfileService, 
  deleteProfileService, 
  logoutService 
} = require('../services/auth');

jest.mock('../utils', () => ({
  prisma: { user: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() } },
  logger: { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() },
  publishKafkaEvent: jest.fn(),
  generateInvisibleKey: jest.fn(() => 'invisible-key')
}));
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Services Integration', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('loginService', () => {
    it('returns error if missing credentials', async () => {
      const res = await loginService({});
      expect(res.error).toBe('MISSING_CREDENTIALS');
    });

    it('returns token if valid', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'a@b.c', hash: 'hash', firstName: 'A', lastName: 'B', role: 'VISITOR', birthDate: new Date(), invisibleKey: 'ik' });
      bcrypt.compare.mockResolvedValue(true);
      process.env.JWT_SECRET = 'x'.repeat(32);
      jwt.sign.mockReturnValue('token');
      const res = await loginService({ email: 'a@b.c', password: 'pw' });
      expect(res.token).toBe('token');
    });
  });

  describe('registerUserService', () => {
    it('returns error if missing fields', async () => {
      const res = await registerUserService({});
      expect(res.error).toBe('MISSING_REQUIRED_FIELDS');
    });

    it('creates user if valid', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ id: 1, email: 'a@b.c', firstName: 'A', lastName: 'B', role: 'VISITOR', birthDate: new Date(), invisibleKey: 'ik' });
      process.env.JWT_SECRET = 'x'.repeat(32);
      jwt.sign.mockReturnValue('token');
      const res = await registerUserService({ email: 'a@b.c', password: 'pw', firstName: 'A', lastName: 'B', birthDate: '2000-01-01' });
      expect(res.id).toBe(1);
      expect(res.token).toBe('token');
    });
  });

  describe('getProfileService', () => {
    it('returns error if invalid id', async () => {
      const res = await getProfileService('abc');
      expect(res.error).toBe('INVALID_USER_ID');
    });

    it('returns user if found', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'a@b.c' });
      const res = await getProfileService(1);
      expect(res.id).toBe(1);
    });
  });

  describe('updateProfileService', () => {
    it('returns error if invalid id', async () => {
      const res = await updateProfileService('abc', {});
      expect(res.error).toBe('INVALID_USER_ID');
    });

    it('updates user if valid', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1 });
      prisma.user.update.mockResolvedValue({ id: 1, email: 'a@b.c' });
      const res = await updateProfileService(1, { firstName: 'New' });
      expect(res.id).toBe(1);
    });
  });

  describe('deleteProfileService', () => {
    it('returns null if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      const res = await deleteProfileService(1);
      expect(res).toBeNull();
    });

    it('deletes user if found', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1 });
      prisma.user.delete.mockResolvedValue(true);
      const res = await deleteProfileService(1);
      expect(res).toBe(true);
    });
  });

  describe('logoutService', () => {
    it('returns error if invalid user', async () => {
      const res = await logoutService({});
      expect(res.error).toBe('INVALID_USER_ID');
    });

    it('returns true if valid', async () => {
      const res = await logoutService({ userId: 1 });
      expect(res).toBe(true);
    });
  });
});
