const { creerUtilisateurAvecDonnees } = require('../services/utilisateur.service');
const {
  getUtilisateurParId,
  getTousLesUtilisateurs
} = require('../models/utilisateur.model');

// ✅ POST /api/utilisateur
const creerUtilisateur = async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe, role } = req.body;

    if (!nom || !prenom || !email || !mot_de_passe) {
      return res.status(400).json({ message: 'Champs requis manquants.' });
    }

    const utilisateur = await creerUtilisateurAvecDonnees({
      nom,
      prenom,
      email,
      mot_de_passe,
      role
    });

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      utilisateur
    });
  } catch (err) {
    console.error('[UTILISATEUR][CREATE]', err.message);
    res.status(500).json({ message: "Erreur lors de la création de l'utilisateur." });
  }
};

// ✅ PUT /api/utilisateur/:id
const mettreAJourUtilisateur = (req, res) => {
  const { id } = req.params;
  const utilisateur = getUtilisateurParId(id);

  if (!utilisateur) {
    return res.status(404).json({ message: 'Utilisateur non trouvé.' });
  }

  const { nom, prenom, email, mot_de_passe, role } = req.body;

  if (nom) utilisateur.nom = nom;
  if (prenom) utilisateur.prenom = prenom;
  if (email) utilisateur.email = email.toLowerCase().trim();
  if (mot_de_passe) utilisateur.hash = mot_de_passe; // hash à sécuriser si en prod
  if (role) utilisateur.role = role;

  res.status(200).json({
    message: 'Utilisateur mis à jour avec succès',
    utilisateur
  });
};

// ✅ GET /api/utilisateur/:id
const obtenirUtilisateur = (req, res) => {
  const { id } = req.params;
  const utilisateur = getUtilisateurParId(id);

  if (!utilisateur) {
    return res.status(404).json({ message: 'Utilisateur non trouvé.' });
  }

  res.status(200).json(utilisateur);
};

// ✅ GET /api/utilisateur
const listerUtilisateurs = (req, res) => {
  const utilisateurs = getTousLesUtilisateurs();
  res.status(200).json(utilisateurs);
};

// ✅ DELETE /api/utilisateur/:id
const supprimerUtilisateur = (req, res) => {
  const { id } = req.params;
  const utilisateurs = getTousLesUtilisateurs();
  const index = utilisateurs.findIndex((u) => u.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ message: 'Utilisateur non trouvé.' });
  }

  utilisateurs.splice(index, 1);
  res.status(204).send();
};

module.exports = {
  creerUtilisateur,
  mettreAJourUtilisateur,
  obtenirUtilisateur,
  listerUtilisateurs,
  supprimerUtilisateur
};
