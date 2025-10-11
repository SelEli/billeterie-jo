// services/ticketing/validators/event.validator.js
const { z } = require('zod');

// Création : champs obligatoires
const createEventSchema = z.object({
  label: z.string().min(1, 'Label requis'),
  date: z.coerce.date(),
  location: z.string().min(1, 'Lieu requis'),
  category: z.string().min(1, 'Catégorie requise') // chaîne libre → alimentée par la DB
});

// Update : tous optionnels
const updateEventSchema = z.object({
  label: z.string().min(1).optional(),
  date: z.coerce.date().optional(),
  location: z.string().min(1).optional(),
  category: z.string().min(1).optional() // idem, chaîne libre
});

module.exports = {
  createEventSchema,
  updateEventSchema
};
