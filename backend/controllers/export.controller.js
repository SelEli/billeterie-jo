const { getTousLesBillets } = require('../models/billet.model');
const { getTousLesPaiements } = require('../models/paiement.model');
const { Parser } = require('json2csv');

// Export CSV des billets
const exporterBilletsCSV = (req, res) => {
  try {
    const billets = getTousLesBillets();

    if (!billets || billets.length === 0) {
      return res.status(204).json({ message: 'Aucun billet à exporter.' });
    }

    const champs = ['id', 'id_utilisateur', 'id_evenement', 'statut'];
    const parser = new Parser({ fields: champs });
    const csv = parser.parse(billets);

    const dateJour = new Date().toISOString().split('T')[0];
    const nomFichier = `export-billets-${dateJour}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${nomFichier}"`);
    res.status(200).send(csv);
  } catch (error) {
    console.error('[EXPORT][Billets]', error.message);
    res.status(500).json({ message: "Erreur lors de l'export CSV des billets." });
  }
};

// Export CSV des paiements
const exporterPaiementsCSV = (req, res) => {
  try {
    const paiements = getTousLesPaiements();

    if (!paiements || paiements.length === 0) {
      return res.status(204).json({ message: 'Aucun paiement à exporter.' });
    }

    const champs = ['id', 'id_utilisateur', 'montant', 'statut', 'date'];
    const parser = new Parser({ fields: champs });
    const csv = parser.parse(paiements);

    const dateJour = new Date().toISOString().split('T')[0];
    const nomFichier = `export-paiements-${dateJour}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${nomFichier}"`);
    res.status(200).send(csv);
  } catch (error) {
    console.error('[EXPORT][Paiements]', error.message);
    res.status(500).json({ message: "Erreur lors de l'export CSV des paiements." });
  }
};

module.exports = {
  exporterBilletsCSV,
  exporterPaiementsCSV,
};
