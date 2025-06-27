const express = require('express');
const router = express.Router();

const { verifyToken, verifyRole } = require('../middleware/auth.middleware');
const { getToutesLesOffres } = require('../models/offre.model');
const { getToutesLesBillets } = require('../models/billet.model');

// GET /api/stats/offres → admin only
router.get('/offres', verifyToken, verifyRole(['admin']), (req, res) => {
  const offres = getToutesLesOffres();
  const billets = getToutesLesBillets();

  const stats = offres.map((offre) => {
    const nombre_billets = billets.filter((b) => b.id_offre === offre.id).length;
    return {
      nom: offre.nom,
      description: offre.description,
      nombre_personnes: offre.nombre_personnes,
      billets_vendus: nombre_billets
    };
  });

  res.json(stats);
});

module.exports = router;
