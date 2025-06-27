const { ajouterBillet } = require('../models/billet.model');
const { ajouterPaiement } = require('../models/paiement.model');
const { getEvenementParId } = require('../models/evenement.model');
const crypto = require('crypto');

const acheterBillet = (req, res) => {
  const { id_evenement, prix, id_type_billet, id_offre } = req.body;
  const id_utilisateur = req.user.utilisateurId;

  const evenement = getEvenementParId(id_evenement);
  if (!evenement || evenement.nombre_places_dispo <= 0) {
    return res.status(400).json({ message: 'Événement complet ou introuvable.' });
  }

  const cle_achat = crypto.randomBytes(16).toString('hex');

  const paiement = ajouterPaiement({
    id_utilisateur,
    montant: prix,
    statut: 'validé'
  });

  const billet = ajouterBillet({
    id_utilisateur,
    id_evenement,
    id_type_billet,
    id_offre,
    id_paiement: paiement.id,
    prix,
    cle_achat,
    statut: 'valide'
  });

  evenement.nombre_places_dispo--;

  res.status(201).json({
    message: 'Billet acheté avec succès',
    billet,
    paiement
  });
};

module.exports = { acheterBillet };
