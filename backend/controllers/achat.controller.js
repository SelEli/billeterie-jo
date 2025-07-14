const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

const acheterBillet = async (req, res) => {
  const { id_evenement, prix, id_type_billet, id_offre } = req.body;
  const id_utilisateur = req.user.utilisateurId;

  const evenement = await prisma.evenement.findUnique({
    where: { id: id_evenement }
  });

  if (!evenement || evenement.nombre_places_dispo <= 0) {
    return res.status(400).json({ message: 'Événement complet ou introuvable.' });
  }

  const cle_achat = crypto.randomBytes(16).toString('hex');

  const paiement = await prisma.paiement.create({
    data: {
      id_utilisateur,
      montant: parseInt(prix),
      methode: 'CB',
      date: new Date()
    }
  });

  const billet = await prisma.billet.create({
    data: {
      id_utilisateur,
      id_evenement,
      id_type_billet,
      id_offre,
      id_paiement: paiement.id,
      prix: parseInt(prix),
      cle_achat,
      statut: 'valide'
    }
  });

  await prisma.evenement.update({
    where: { id: id_evenement },
    data: {
      nombre_places_dispo: evenement.nombre_places_dispo - 1
    }
  });

  res.status(201).json({
    message: 'Billet acheté avec succès',
    billet,
    paiement
  });
};

module.exports = { acheterBillet };
