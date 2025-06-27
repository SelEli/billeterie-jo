const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth.middleware');

const { getEvenementParId } = require('../models/evenement.model');
const { getTypeBilletParId } = require('../models/typeBillet.model');
const { ajouterPaiement } = require('../models/paiement.model');
const { ajouterBillet } = require('../models/billet.model');
const { genererCleAchat, genererCleInvisible } = require('../utils/crypto');

// POST /api/achat
router.post('/', verifyToken, (req, res) => {
  const { id_evenement, id_type_billet } = req.body;
  const utilisateurId = req.user.utilisateurId;

  if (!id_evenement || !id_type_billet) {
    return res.status(400).json({ message: "Champs requis manquants." });
  }

  // 1. Vérification de l'événement
  const evenement = getEvenementParId(id_evenement);
  if (!evenement) {
    return res.status(404).json({ message: "Événement introuvable." });
  }

  // 2. Vérification du type de billet
  const typeBillet = getTypeBilletParId(id_type_billet);
  if (!typeBillet) {
    return res.status(404).json({ message: "Type de billet introuvable." });
  }

  // 3. Vérification du stock
  if (evenement.nombre_places_dispo < typeBillet.nombre_places) {
    return res.status(400).json({ message: "Stock insuffisant pour ce billet." });
  }

  // 4. Création du paiement simulé
  const paiement = ajouterPaiement({
    id_utilisateur: utilisateurId,
    montant: typeBillet.prix,
    date: new Date(),
    statut: 'validé'
  });

  // 5. Génération d'une clé d'achat (publique) et d'une clé invisible
  const cleAchat = genererCleAchat();
  const cleInvisible = genererCleInvisible();

  // 6. Création du billet
  const billet = ajouterBillet({
    id_utilisateur: utilisateurId,
    id_evenement,
    id_type_billet,
    id_paiement: paiement.id,
    prix: typeBillet.prix,
    cle_achat: cleAchat,
    cle_invisible: cleInvisible,
    statut: 'valide'
  });

  // 7. Décrémentation du nombre de places restantes
  evenement.nombre_places_dispo -= typeBillet.nombre_places;

  // 8. Réponse
  res.status(201).json({ billet });
});

module.exports = router;
