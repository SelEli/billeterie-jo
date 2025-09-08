const { PrismaClient } = require('@prisma/client');

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.__PRISMA_CLIENT__) {
    global.__PRISMA_CLIENT__ = new PrismaClient();
  }
  prisma = global.__PRISMA_CLIENT__;
}

module.exports = prisma;
