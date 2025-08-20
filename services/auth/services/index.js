// services/index.js
// Point d'entrée unique pour les services transverses,
// ré-exportés depuis utils pour éviter toute duplication.

const {
  logger,
  publishKafkaEvent,
  generateInvisibleKey
} = require('../utils');

module.exports = {
  logger,
  publishKafkaEvent,
  generateInvisibleKey
};
