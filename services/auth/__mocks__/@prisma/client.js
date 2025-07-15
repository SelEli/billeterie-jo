const userMock = {
  create: jest.fn().mockResolvedValue({
    id: 1,
    email: 'testuser@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'employee'
  }),

  findUnique: jest.fn().mockResolvedValue({
    id: 1,
    email: 'testuser@example.com',
    firstName: 'Updated',
    lastName: 'User',
    role: 'employee'
  }),

  update: jest.fn().mockResolvedValue({
    id: 1,
    email: 'testuser@example.com',
    firstName: 'Updated',
    lastName: 'User',
    role: 'employee'
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
