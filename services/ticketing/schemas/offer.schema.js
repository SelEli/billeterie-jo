// schemas/offer.schema.js
const { z } = require('zod');

// 🎯 Rôles autorisés
const roles = ['VISITOR', 'USER', 'ADMIN', 'EMPLOYEE', 'AGENT'];

// 🛠 Schéma de base pour création
const createOfferSchema = z.object({
  label: z
    .string()
    .min(3, { message: 'Label must be at least 3 characters' }),
  discount: z
    .number()
    .min(0, { message: 'Discount must be >= 0' })
    .max(1, { message: 'Discount must be between 0 and 1 (e.g., 0.25)' }),
  active: z.boolean().optional(),
  targetRole: z.enum(roles, {
    errorMap: () => ({ message: `Target role must be one of: ${roles.join(', ')}` })
  }),
  eventId: z.number().int().positive().optional(),
  validFrom: z.coerce.date().optional(),
  validTo: z.coerce.date().optional(),
  quota: z.number().int().positive().optional()
}).refine((data) => {
  if (data.validFrom && data.validTo) {
    return data.validFrom < data.validTo;
  }
  return true;
}, {
  message: 'validFrom must be before validTo',
  path: ['validFrom']
});

// 🛠 Schéma de mise à jour (tous champs optionnels)
const updateOfferSchema = createOfferSchema
  .partial()
  .refine((data) => {
    if (data.validFrom && data.validTo) {
      return data.validFrom < data.validTo;
    }
    return true;
  }, {
    message: 'validFrom must be before validTo',
    path: ['validFrom']
  });

module.exports = {
  createOfferSchema,
  updateOfferSchema
};
