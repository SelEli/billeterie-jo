const { z } = require('zod');

// 📅 Schéma création d’événement
const createEventSchema = z.object({
  label: z
    .string()
    .min(3, { message: 'Label must be at least 3 characters' })
    .max(200, { message: 'Label cannot exceed 200 characters' }),

  date: z.coerce.date().refine(d => d > new Date(), {
    message: 'Date must be in the future'
  }),

  location: z
    .string()
    .min(3, { message: 'Location must be at least 3 characters' })
    .max(200, { message: 'Location cannot exceed 200 characters' }),

  category: z
    .string()
    .min(1, { message: 'Category cannot be empty' })
    .max(50, { message: 'Category cannot exceed 50 characters' })
    .optional(),

  // ⚡ Nouveaux champs pro
  capacity: z.number()
    .int()
    .positive({ message: 'Capacity must be a positive integer' })
    .optional(),

  status: z.enum(['DRAFT', 'PUBLISHED', 'SOLD_OUT', 'CANCELLED']).optional(),

  description: z.string()
    .max(1000, { message: 'Description cannot exceed 1000 characters' })
    .optional(),

  imageUrl: z.string()
    .url({ message: 'Image must be a valid URL' })
    .optional()
});

// ✏ Schéma mise à jour (tous champs optionnels)
const updateEventSchema = createEventSchema.partial().refine((data) => {
  if (data.date) {
    return data.date > new Date();
  }
  return true;
}, {
  message: 'Updated date must be in the future',
  path: ['date']
});

module.exports = {
  createEventSchema,
  updateEventSchema
};
