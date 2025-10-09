const { z } = require('zod');

// Schéma de base
const OfferBaseSchema = z.object({
  label: z.string()
    .min(3, { message: 'Le nom doit contenir au moins 3 caractères' })
    .max(200, { message: 'Le nom ne peut pas dépasser 200 caractères' }),

  discount: z.coerce.number()
    .min(0, { message: 'La réduction doit être >= 0' })
    .max(1, { message: 'La réduction doit être <= 1 (ex: 0.25 pour 25%)' }),

  // accepte "", null, undefined → ignoré ; sinon coercion en booléen
  active: z.preprocess(
    (val) => (val === '' || val == null ? undefined : val),
    z.coerce.boolean().optional()
  ),

  eventId: z.coerce.number().int().positive().optional(),

  validFrom: z.preprocess(
    (val) => (val === '' || val == null ? undefined : val),
    z.string()
      .refine(val => !isNaN(Date.parse(val)), { message: 'Date invalide' })
      .transform(val => new Date(val))
      .optional()
  ),

  validTo: z.preprocess(
    (val) => (val === '' || val == null ? undefined : val),
    z.string()
      .refine(val => !isNaN(Date.parse(val)), { message: 'Date invalide' })
      .transform(val => new Date(val))
      .optional()
  ),

  quota: z.coerce.number().int().positive().optional()
});

// Création
const OfferCreateSchema = OfferBaseSchema.superRefine((data, ctx) => {
  if (data.validFrom && data.validTo && data.validFrom >= data.validTo) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'validFrom doit être antérieur à validTo',
      path: ['validFrom']
    });
  }
});

// Mise à jour (tous champs optionnels + id obligatoire)
const OfferUpdateSchema = OfferBaseSchema.partial().extend({
  id: z.preprocess(
    (val) => Number(val),
    z.number().int().positive()
  )
}).superRefine((data, ctx) => {
  if (data.validFrom && data.validTo && data.validFrom >= data.validTo) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'validFrom doit être antérieur à validTo',
      path: ['validFrom']
    });
  }
});

module.exports = {
  OfferCreateSchema,
  OfferUpdateSchema
};
