const { z } = require('zod');

// Schéma de base pour un événement
const EventBaseSchema = z.object({
  label: z.string()
    .min(3, { message: 'Le titre doit contenir au moins 3 caractères' })
    .max(200, { message: 'Le titre ne peut pas dépasser 200 caractères' }),

  date: z.coerce.date(), // on valide la logique métier plus bas

  location: z.string()
    .min(3, { message: 'Le lieu doit contenir au moins 3 caractères' })
    .max(200, { message: 'Le lieu ne peut pas dépasser 200 caractères' }),

  category: z.string().max(50).optional(),
  capacity: z.number().int().positive().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SOLD_OUT', 'CANCELLED']).optional(),
  description: z.string().max(1000).optional(),
  imageUrl: z.string().url().optional()
});

// Création : tous les champs obligatoires de base + règle métier sur la date
const EventCreateSchema = EventBaseSchema.superRefine((data, ctx) => {
  if (data.date && data.date <= new Date()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'La date doit être dans le futur',
      path: ['date']
    });
  }
});

// Mise à jour : tous les champs optionnels + id obligatoire + règle métier sur la date
const EventUpdateSchema = EventBaseSchema.partial().extend({
  id: z.string().regex(/^\d+$/, { message: 'id doit être une chaîne numérique' }).transform(Number)
}).superRefine((data, ctx) => {
  if (data.date && data.date <= new Date()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'La date mise à jour doit être dans le futur',
      path: ['date']
    });
  }
});

module.exports = {
  EventCreateSchema,
  EventUpdateSchema
};
