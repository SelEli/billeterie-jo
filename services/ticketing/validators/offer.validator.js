const { z } = require('zod');

/**
 * ✅ Schéma pour création d'une offre
 * Tous les champs obligatoires, validation de forme uniquement.
 * Les valeurs (ex: devise) seront contrôlées côté service/DB si besoin.
 */
const createOfferSchema = z.object({
  title: z.string().min(1, 'Titre requis'),
  description: z.string().min(1, 'Description requise'),
  price: z.number({
    required_error: 'Prix requis',
    invalid_type_error: 'Le prix doit être un nombre'
  }),
  currency: z.string().min(1, 'Devise requise'),
  validUntil: z.coerce.date({
    required_error: 'Date de validité requise'
  })
});

/**
 * ✅ Schéma pour mise à jour d'une offre
 * Tous les champs sont optionnels pour les updates partiels.
 */
const updateOfferSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.number().optional(),
  currency: z.string().min(1).optional(),
  validUntil: z.coerce.date().optional()
});

module.exports = {
  createOfferSchema,
  updateOfferSchema
};
