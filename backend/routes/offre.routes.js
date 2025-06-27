const express = require('express');
const router = express.Router();

const {
  getToutesLesOffres,
  getOffreParId,
  ajouterOffre,
  modifierOffre,
  supprimerOffre
} = require('../models/offre.model');

const verifyToken = require('../middlewares/auth.middleware');
const verifyRole = require('../middlewares/role.middleware');

// GET /api/offres → public
router.get('/', (req, res) => {
  const offres = getToutesLesOffres().filter((o) => o.visible !== false);
  res.json(offres);
});

// GET /api/offres/:id → public
router.get('/:id', (req, res) => {
  const offre = getOffreParId(req.params.id);
  if (!offre || offre.visible === false) {
    return res.status(404).json({ message: 'Offre introuvable' });
  }
  res.json(offre);
});

// POST /api/offres → admin only
router.post('/', verifyToken, verifyRole(['admin']), (req, res) => {
  const { nom, description, nombre_personnes, visible } = req.body;
  if (!nom || !description || !nombre_personnes) {
    return res.status(400).json({ message: 'Champs obligatoires manquants' });
  }
  const nouvelleOffre = ajouterOffre({ nom, description, nombre_personnes, visible });
  res.status(201).json(nouvelleOffre);
});

// PUT /api/offres/:id → admin only
router.put('/:id', verifyToken, verifyRole(['admin']), (req, res) => {
  const modif = modifierOffre(req.params.id, req.body);
  if (!modif) {
    return res.status(404).json({ message: 'Offre non trouvée' });
  }
  res.json(modif);
});

// DELETE /api/offres/:id → admin only
router.delete('/:id', verifyToken, verifyRole(['admin']), (req, res) => {
  const success = supprimerOffre(req.params.id);
  if (!success) {
    return res.status(404).json({ message: 'Offre non trouvée' });
  }
  res.status(204).send();
});

module.exports = router;
