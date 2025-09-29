const { z } = require('zod');

// Création d’événement
const EventCreateSchema = z.object({
  label: z.string()
    .min(3, { message: 'Le titre doit contenir au moins 3 caractères' })
    .max(200, { message: 'Le titre ne peut pas dépasser 200 caractères' }),

  date: z.coerce.date().refine(d => d > new Date(), {
    message: 'La date doit être dans le futur'
  }),

  location: z.string()
    .min(3, { message: 'Le lieu doit contenir au moins 3 caractères' })
    .max(200, { message: 'Le lieu ne peut pas dépasser 200 caractères' }),

  category: z.string().max(50).optional(),
  capacity: z.number().int().positive().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SOLD_OUT', 'CANCELLED']).optional(),
  description: z.string().max(1000).optional(),
  imageUrl: z.string().url().optional()
});

// Mise à jour (tous champs optionnels + id obligatoire)
const EventUpdateSchema = EventCreateSchema.partial().extend({
  id: z.string().regex(/^\d+$/).transform(Number)
}).refine((data) => {
  if (data.date) return data.date > new Date();
  return true;
}, {
  message: 'La date mise à jour doit être dans le futur',
  path: ['date']
});

module.exports = {
  EventCreateSchema,
  EventUpdateSchema
};
