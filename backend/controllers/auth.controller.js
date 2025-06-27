const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
  creerUtilisateur,
  trouverParEmail
} = require('../models/utilisateur.model');
const { genererCleInvisible } = require('../utils/crypto');

const DUREE_TOKEN = '1h';

exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe } = req.body;

    if (!nom || !prenom || !email || !mot_de_passe) {
      return res.status(400).json({ message: 'Champs requis manquants.' });
    }

    const emailClean = email.trim().toLowerCase();
    const utilisateurExistant = trouverParEmail(emailClean);
    if (utilisateurExistant) {
      return res.status(409).json({ message: 'Utilisateur déjà enregistré.' });
    }

    const hash = await bcrypt.hash(mot_de_passe, 10);

    const nouvelUtilisateur = creerUtilisateur({
      nom,
      prenom,
      email: emailClean,
      hash,
      cle_invisible: genererCleInvisible(),
      role: 'utilisateur'
    });

    const token = jwt.sign({
      utilisateurId: nouvelUtilisateur.id,
      nom: nouvelUtilisateur.nom,
      prenom: nouvelUtilisateur.prenom,
      role: nouvelUtilisateur.role
    }, process.env.JWT_SECRET, { expiresIn: DUREE_TOKEN });

    res.status(201).json({
      message: 'Inscription réussie',
      utilisateur: {
        id: nouvelUtilisateur.id,
        nom: nouvelUtilisateur.nom,
        prenom: nouvelUtilisateur.prenom,
        email: nouvelUtilisateur.email,
        role: nouvelUtilisateur.role
      },
      token
    });
  } catch (error) {
    console.error('[AUTH][REGISTER]', error.message);
    res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
      return res.status(400).json({ message: 'Champs requis manquants.' });
    }

    const emailClean = email.trim().toLowerCase();
    const utilisateur = trouverParEmail(emailClean);

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    const valid = await bcrypt.compare(mot_de_passe, utilisateur.hash || '');
    if (!valid) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    const token = jwt.sign({
      utilisateurId: utilisateur.id,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      role: utilisateur.role
    }, process.env.JWT_SECRET, { expiresIn: DUREE_TOKEN });

    res.status(200).json({
      utilisateur: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role: utilisateur.role
      },
      token
    });
  } catch (error) {
    console.error('[AUTH][LOGIN]', error.message);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion.' });
  }
};
