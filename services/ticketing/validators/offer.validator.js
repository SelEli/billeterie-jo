// validators/offer.validator.js
const { z } = require('zod');

const roles = ['VISITOR', 'USER', 'ADMIN', 'EMPLOYEE', 'AGENT'];

const createOfferSchema = z.object({
  label: z.string().min(3, 'Label must be at least 3 characters'),
  discount: z.number().min(0).max(1, 'Discount must be between 0 and 1 (e.g., 0.25)'),
  active: z.boolean().optional(),
  targetRole: z.enum(roles),
  eventId: z.number().int().positive().optional(),
  validFrom: z.string().datetime().optional(),
  validTo: z.string().datetime().optional(),
  quota: z.number().int().positive().optional()
}).refine((data) => {
  if (data.validFrom && data.validTo) {
    return new Date(data.validFrom) < new Date(data.validTo);
  }
  return true;
}, { message: 'validFrom must be before validTo', path: ['validFrom'] });

const updateOfferSchema = createOfferSchema.partial().refine((data) => {
  if (data.validFrom && data.validTo) {
    return new Date(data.validFrom) < new Date(data.validTo);
  }
  return true;
}, { message: 'validFrom must be before validTo', path: ['validFrom'] });

module.exports = { createOfferSchema, updateOfferSchema };
