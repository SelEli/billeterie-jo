const {
  getTousLesEvenements,
  getEvenementParId,
  ajouterEvenement,
  modifierEvenement,
  supprimerEvenement
} = require('../models/evenement.model');

// GET /api/evenements
const listerEvenements = (req, res) => {
  try {
    const evenements = getTousLesEvenements();
    res.status(200).json(evenements);
  } catch (err) {
    console.error('[EVT] Erreur listerEvenements', err.message);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des événements." });
  }
};

// GET /api/evenements/:id
const obtenirEvenement = (req, res) => {
  try {
    const evenement = getEvenementParId(req.params.id);
    if (!evenement) {
      return res.status(404).json({ message: 'Événement introuvable.' });
    }
    res.status(200).json(evenement);
  } catch (err) {
    console.error('[EVT] Erreur obtenirEvenement', err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// POST /api/evenements
const creerEvenement = (req, res) => {
  try {
    const { nom, date, lieu, nombre_places_dispo } = req.body;

    if (!nom || !date || !lieu || !nombre_places_dispo) {
      return res.status(400).json({ message: 'Champs requis manquants.' });
    }

    const evenement = ajouterEvenement({
      nom,
      date,
      lieu,
      nombre_places_dispo: parseInt(nombre_places_dispo)
    });

    res.status(201).json({ evenement });
  } catch (err) {
    console.error('[EVT] Erreur creerEvenement', err.message);
    res.status(500).json({ message: "Erreur lors de la création de l'événement." });
  }
};

// PUT /api/evenements/:id
const modifierEvenementHandler = (req, res) => {
  try {
    const maj = req.body;
    const modif = modifierEvenement(req.params.id, maj);
    if (!modif) {
      return res.status(404).json({ message: 'Événement non trouvé.' });
    }
    res.status(200).json(modif);
  } catch (err) {
    console.error('[EVT] Erreur modifierEvenement', err.message);
    res.status(500).json({ message: "Erreur lors de la modification." });
  }
};

// DELETE /api/evenements/:id
const supprimerEvenementHandler = (req, res) => {
  try {
    supprimerEvenement(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.error('[EVT] Erreur supprimerEvenement', err.message);
    res.status(500).json({ message: "Erreur lors de la suppression de l'événement." });
  }
};

module.exports = {
  listerEvenements,
  obtenirEvenement,
  creerEvenement,
  modifierEvenement: modifierEvenementHandler,
  supprimerEvenement: supprimerEvenementHandler
};
