// utils/prismaClient.js
const { PrismaClient } = require('@prisma/client');

let prisma;

if (process.env.NODE_ENV === 'production') {
  // En production, crée une instance classique
  prisma = new PrismaClient();
} else {
  // En dev / test, utilise une instance globale pour éviter les doublons lors du hot-reload
  if (!global.__PRISMA_CLIENT__) {
    global.__PRISMA_CLIENT__ = new PrismaClient();
  }
  prisma = global.__PRISMA_CLIENT__;
}

module.exports = prisma;
