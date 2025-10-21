const { z } = require('zod');

// --- Schéma de base ---
const eventBaseSchema = z.object({
  label: z.string()
    .min(3, { message: 'Le titre doit contenir au moins 3 caractères' })
    .max(200, { message: 'Le titre ne peut pas dépasser 200 caractères' }),

  date: z.string()
    .refine(val => !isNaN(Date.parse(val)), { message: 'Date invalide' })
    .transform(val => new Date(val)),

  location: z.string()
    .min(3, { message: 'Le lieu doit contenir au moins 3 caractères' })
    .max(200, { message: 'Le lieu ne peut pas dépasser 200 caractères' }),

  category: z.string().max(50).optional(),
  capacity: z.coerce.number().int().positive().optional(),

  // 👇 accepte "" comme undefined
  status: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.enum(['DRAFT', 'PUBLISHED', 'SOLD_OUT', 'CANCELLED']).optional()
  ),

  description: z.string().max(1000).optional(),

  imageUrl: z.preprocess(
    (val) => (val === '' || val == null ? undefined : val),
    z.string().url().optional()
  ),

  // --- Nouveaux champs ---
  basePrice: z.coerce.number()
    .nonnegative({ message: 'Le prix de base doit être positif ou nul' })
    .default(0),

  zones: z.array(z.string().min(1))
    .nonempty({ message: 'Il doit y avoir au moins une zone' })
    .default(['A', 'B', 'C', 'D'])
});

// --- Création ---
const createEventSchema = eventBaseSchema.superRefine((data, ctx) => {
  if (data.date && data.date <= new Date()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'La date doit être dans le futur',
      path: ['date']
    });
  }
});

// --- Mise à jour (tous les champs optionnels, pas d'id dans le body) ---
const updateEventSchema = eventBaseSchema.partial().superRefine((data, ctx) => {
  if (data.date && data.date <= new Date()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'La date mise à jour doit être dans le futur',
      path: ['date']
    });
  }
});

module.exports = {
  createEventSchema,
  updateEventSchema
};
