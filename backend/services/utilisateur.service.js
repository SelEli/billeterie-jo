const { creerUtilisateur } = require('../models/utilisateur.model');
const bcrypt = require('bcrypt');
const { genererCleInvisible } = require('../utils/crypto');

async function creerUtilisateurAvecDonnees({ nom, prenom, email, mot_de_passe, role }) {
  const hash = await bcrypt.hash(mot_de_passe, 10);

  return creerUtilisateur({
    nom,
    prenom,
    email: email.toLowerCase(),
    hash,
    cle_invisible: genererCleInvisible(),
    role: role || 'utilisateur'
  });
}

module.exports = { creerUtilisateurAvecDonnees };
