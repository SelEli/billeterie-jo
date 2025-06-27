// scripts/reset.js

const { resetUtilisateurs } = require('../models/utilisateur.model');
const { resetBillets } = require('../models/billet.model');
const { resetValidations } = require('../models/validation.model');

function resetTout() {
  resetUtilisateurs();
  resetBillets();
  resetValidations();
  console.log('✅ Données réinitialisées en mémoire');
}

resetTout();
