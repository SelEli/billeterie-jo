const { z } = require('zod');

// Rôles cibles possibles
const roles = ['VISITOR', 'USER', 'ADMIN', 'EMPLOYEE', 'AGENT'];

// Schéma de base
const OfferBaseSchema = z.object({
  label: z.string()
    .min(3, { message: 'Le nom doit contenir au moins 3 caractères' })
    .max(200, { message: 'Le nom ne peut pas dépasser 200 caractères' }),

  discount: z.number()
    .min(0, { message: 'La réduction doit être >= 0' })
    .max(1, { message: 'La réduction doit être <= 1 (ex: 0.25 pour 25%)' }),

  active: z.boolean().optional(),
  targetRole: z.enum(roles).optional(),
  eventId: z.number().int().positive().optional(),
  validFrom: z.coerce.date().optional(),
  validTo: z.coerce.date().optional(),
  quota: z.number().int().positive().optional()
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
  id: z.string().regex(/^\d+$/).transform(Number)
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
