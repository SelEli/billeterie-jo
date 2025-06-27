const express = require('express');
const router = express.Router();

const {
  validerUtilisateurCreation,
  validerUtilisateurMaj
} = require('../middlewares/utilisateur.middleware');

const {
  creerUtilisateur,
  mettreAJourUtilisateur,
  obtenirUtilisateur,
  listerUtilisateurs,
  supprimerUtilisateur
} = require('../controllers/utilisateur.controller');

// POST /api/utilisateur → Création d’un utilisateur
router.post('/', validerUtilisateurCreation, creerUtilisateur);

// PUT /api/utilisateur/:id → Mise à jour
router.put('/:id', validerUtilisateurMaj, mettreAJourUtilisateur);

// DELETE /api/utilisateur/:id → Suppression
router.delete('/:id', supprimerUtilisateur);

// GET /api/utilisateur/:id → Obtenir un utilisateur
router.get('/:id', obtenirUtilisateur);

// GET /api/utilisateur → Liste tous les utilisateurs (filtrage possible)
router.get('/', listerUtilisateurs);

module.exports = router;
