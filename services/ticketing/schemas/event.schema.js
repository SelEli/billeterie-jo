const { z } = require('zod');

const EventBaseSchema = z.object({
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
  status: z.enum(['DRAFT', 'PUBLISHED', 'SOLD_OUT', 'CANCELLED']).optional(),
  description: z.string().max(1000).optional(),

  // plus flexible : accepte undefined, null, ou string vide
  imageUrl: z.preprocess(
    (val) => (val === '' || val == null ? undefined : val),
    z.string().url().optional()
  )
});

const EventCreateSchema = EventBaseSchema.superRefine((data, ctx) => {
  if (data.date && data.date <= new Date()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'La date doit être dans le futur',
      path: ['date']
    });
  }
});

const EventUpdateSchema = EventBaseSchema.partial().extend({
  // accepte string ou number, converti en number
  id: z.preprocess(
    (val) => Number(val),
    z.number().int().positive()
  )
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
