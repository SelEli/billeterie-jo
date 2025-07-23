// __mocks__/@prisma/client.js
const mockFindUnique = jest.fn();
const mockUpdate      = jest.fn();
const mockCreate      = jest.fn();
const mockDelete      = jest.fn();
const mockFindMany    = jest.fn();

class PrismaClient {
  constructor() {
    this.user   = { findUnique: mockFindUnique, update: mockUpdate };
    this.ticket = {
      create: mockCreate,
      findUnique: mockFindUnique,
      findMany: mockFindMany,
      update: mockUpdate,
      delete: mockDelete
    };
    // … ajoute ici d’autres modèles si besoin
  }
}

module.exports = { PrismaClient };
module.exports.__mockFns = { mockFindUnique, mockUpdate, mockCreate, mockDelete, mockFindMany };
