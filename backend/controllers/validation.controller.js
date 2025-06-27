const { getBilletParId, getTousLesBillets } = require('../models/billet.model');
const { getUtilisateurParCleInvisible } = require('../models/utilisateur.model');
const {
  ajouterValidation,
  getValidationParId,
  getToutesLesValidations,
  supprimerValidation
} = require('../models/validation.model');
const { Parser } = require('json2csv');

// POST /api/validation
const validerBillet = (req, res) => {
  const { cle_invisible, cle_achat } = req.body;
  const employe = req.user.utilisateurId;

  if (!cle_invisible || !cle_achat) {
    return res.status(400).json({ message: 'Champs requis manquants.' });
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log('[VAL] Payload reçu :', { cle_invisible, cle_achat });
  }

  const utilisateur = getUtilisateurParCleInvisible(cle_invisible.trim());
  if (!utilisateur) {
    return res.status(404).json({ message: 'Clé invisible invalide.' });
  }

  const billet = getTousLesBillets().find(
    (b) =>
      b.id_utilisateur === utilisateur.id &&
      b.cle_achat === cle_achat.trim()
  );

  if (!billet) {
    return res.status(404).json({ message: 'Billet introuvable ou invalide.' });
  }

  const dejaValide = getToutesLesValidations().some((v) => v.id_billet === billet.id);
  if (dejaValide) {
    return res.status(400).json({ message: 'Billet déjà scanné.' });
  }

  const validation = ajouterValidation({
    id_billet: billet.id,
    heure_scan: new Date(),
    employe_validateur: employe,
    etat_validite: 'valide'
  });

  if (process.env.NODE_ENV !== 'production') {
    console.log('[VAL] Validation créée :', validation);
  }

  res.status(200).json({
    message: 'Billet validé avec succès.',
    validation
  });
};

// GET /api/validation/:id
const afficherValidation = (req, res) => {
  const val = getValidationParId(req.params.id);
  if (!val) {
    return res.status(404).json({ message: 'Validation non trouvée.' });
  }
  res.status(200).json(val);
};

// GET /api/validation (avec filtres)
const listerValidations = (req, res) => {
  const { evenement, employe } = req.query;
  let validations = getToutesLesValidations();

  if (evenement) {
    validations = validations.filter((v) => {
      const billet = getBilletParId(v.id_billet);
      return billet && billet.id_evenement == evenement;
    });
  }

  if (employe) {
    validations = validations.filter((v) => v.employe_validateur == employe);
  }

  res.status(200).json(validations);
};

// DELETE /api/validation/:id
const annulerValidation = (req, res) => {
  const success = supprimerValidation(req.params.id);
  if (!success) {
    return res.status(404).json({ message: 'Validation introuvable.' });
  }
  res.status(200).json({ message: 'Validation annulée avec succès.' });
};

// GET /api/validation/export
const exporterValidationsCSV = (req, res) => {
  const validations = getToutesLesValidations();
  if (!validations.length) {
    return res.status(204).json({ message: 'Aucune validation à exporter.' });
  }

  const champs = ['id_billet', 'employe_validateur', 'heure_scan', 'etat_validite'];
  const parser = new Parser({ fields: champs });
  const csv = parser.parse(validations);

  const nomFichier = `validations-${new Date().toISOString().split('T')[0]}.csv`;
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${nomFichier}"`);
  res.status(200).send(csv);
};

module.exports = {
  validerBillet,
  afficherValidation,
  listerValidations,
  annulerValidation,
  exporterValidationsCSV
};
