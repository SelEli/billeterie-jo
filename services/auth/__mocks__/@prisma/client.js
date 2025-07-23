const userMock = {
  create: jest.fn().mockResolvedValue({
    id: 1,
    email: 'testuser@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'EMPLOYEE',
    invisibleKey: 'abc123xyz',
    lastLogin: null,
    isBlacklisted: false,
    blacklistReason: null,
    birthDate: '1995-05-10T00:00:00.000Z',
    password: 'hashedpw',
    createdAt: new Date(),
    updatedAt: new Date()
  }),

  findUnique: jest.fn().mockResolvedValue({
    id: 1,
    email: 'testuser@example.com',
    firstName: 'Updated',
    lastName: 'User',
    role: 'EMPLOYEE',
    invisibleKey: 'abc123xyz',
    lastLogin: new Date(),
    isBlacklisted: false,
    blacklistReason: null,
    birthDate: '1995-05-10T00:00:00.000Z',
    password: 'hashedpw',
    createdAt: new Date(),
    updatedAt: new Date()
  }),

  update: jest.fn().mockResolvedValue({
    id: 1,
    email: 'testuser@example.com',
    firstName: 'Updated',
    lastName: 'User',
    role: 'ADMIN',
    invisibleKey: 'abc123xyz',
    lastLogin: new Date(),
    isBlacklisted: false,
    blacklistReason: null,
    birthDate: '1995-05-10T00:00:00.000Z',
    password: 'newhash',
    createdAt: new Date(),
    updatedAt: new Date()
  }),

  delete: jest.fn().mockResolvedValue({
    id: 1,
    email: 'testuser@example.com'
  }),

  deleteMany: jest.fn().mockResolvedValue({ count: 1 })
};

module.exports = {
  PrismaClient: jest.fn(() => ({
    user: userMock
  }))
};
