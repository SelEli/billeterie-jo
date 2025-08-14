// validators/event.validator.js
const { z } = require('zod');

// 📅 Schéma création d’événement
const createEventSchema = z.object({
  label: z
    .string()
    .min(3, { message: 'Label must be at least 3 characters' }),
  date: z.coerce.date().refine(d => d > new Date(), {
    message: 'Date must be in the future'
  }),
  location: z
    .string()
    .min(3, { message: 'Location must be at least 3 characters' }),
  category: z
    .string()
    .min(1, { message: 'Category cannot be empty' })
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
