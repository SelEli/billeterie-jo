const { z } = require('zod');

const OfferBaseSchema = z.object({
  label: z.string()
    .min(3, { message: 'Le nom doit contenir au moins 3 caractères' })
    .max(200, { message: 'Le nom ne peut pas dépasser 200 caractères' }),

  discount: z.coerce.number()
    .min(0, { message: 'La réduction doit être >= 0' })
    .max(1, { message: 'La réduction doit être <= 1 (ex: 0.25 pour 25%)' }),

  active: z.coerce.boolean(),

  eventId: z.coerce.number()
    .int({ message: 'ID Événement doit être un entier' })
    .positive({ message: 'ID Événement doit être positif' }),

  validFrom: z.string()
    .refine(val => !isNaN(Date.parse(val)), { message: 'Date valideFrom invalide' })
    .transform(val => new Date(val)),

  validTo: z.string()
    .refine(val => !isNaN(Date.parse(val)), { message: 'Date valideTo invalide' })
    .transform(val => new Date(val)),

  quota: z.coerce.number()
    .int({ message: 'Quota doit être un entier' })
    .positive({ message: 'Quota doit être positif' })
});

// Création
const OfferCreateSchema = OfferBaseSchema.superRefine((data, ctx) => {
  if (data.validFrom >= data.validTo) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'validFrom doit être antérieur à validTo',
      path: ['validFrom']
    });
  }
});

// Mise à jour
const OfferUpdateSchema = OfferBaseSchema.partial()
  .extend({
    id: z.coerce.number().int().positive({ message: 'ID doit être positif' })
  })
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
  OfferCreateSchema,
  OfferUpdateSchema
};
