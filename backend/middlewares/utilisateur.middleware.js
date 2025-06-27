const { check, validationResult } = require('express-validator');

const validerUtilisateurCreation = [
  check('email').isEmail().withMessage('Email invalide'),
  check('nom').notEmpty().withMessage('Le nom est requis'),
  check('prenom').notEmpty().withMessage('Le prénom est requis'),
  check('mot_de_passe')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  (req, res, next) => {
    const erreurs = validationResult(req);
    if (!erreurs.isEmpty()) {
      return res.status(400).json({ erreurs: erreurs.array() });
    }
    next();
  }
];

const validerUtilisateurMaj = [
  check('email').optional().isEmail().withMessage('Email invalide'),
  check('nom').optional().notEmpty().withMessage('Le nom ne peut pas être vide'),
  check('prenom').optional().notEmpty().withMessage('Le prénom ne peut pas être vide'),
  check('mot_de_passe')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  (req, res, next) => {
    const erreurs = validationResult(req);
    if (!erreurs.isEmpty()) {
      return res.status(400).json({ erreurs: erreurs.array() });
    }
    next();
  }
];

module.exports = {
  validerUtilisateurCreation,
  validerUtilisateurMaj
};
