const { z } = require('zod');

const offerBaseSchema = z.object({
  label: z.string()
    .min(3, { message: 'Le nom doit contenir au moins 3 caractères' })
    .max(200, { message: 'Le nom ne peut pas dépasser 200 caractères' }),

  discount: z.coerce.number()
    .min(0, { message: 'La réduction doit être >= 0' })
    .max(1, { message: 'La réduction doit être <= 1 (ex: 0.25 pour 25%)' }),

  active: z.coerce.boolean().default(true),

  // ✅ accepte "2025-10-19T16:04:00.000Z" et renvoie un Date
  validFrom: z.coerce.date().optional().nullable(),
  validTo: z.coerce.date().optional().nullable(),

  quota: z.coerce.number()
    .int({ message: 'Quota doit être un entier' })
    .positive({ message: 'Quota doit être positif' })
    .optional()
});

// --- Création ---
const createOfferSchema = offerBaseSchema.superRefine((data, ctx) => {
  if (data.validFrom && data.validTo && data.validFrom >= data.validTo) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'validFrom doit être antérieur à validTo',
      path: ['validFrom']
    });
  }
});

// --- Mise à jour ---
const updateOfferSchema = offerBaseSchema
  .partial()
  .strip() // ✅ supprime automatiquement les clés non prévues (ex: id)
  .superRefine((data, ctx) => {
    if (data.validFrom && data.validTo && data.validFrom >= data.validTo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'validFrom doit être antérieur à validTo',
        path: ['validFrom']
      });
    }
  });

module.exports = {
  createOfferSchema,
  updateOfferSchema
};
