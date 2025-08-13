const { z } = require('zod');

const createEventSchema = z.object({
  label: z.string().min(3),
  date: z.string().refine(d => new Date(d) > new Date(), {
    message: "Date must be in the future"
  }),
  location: z.string().min(3),
  category: z.string().optional()
});

const updateEventSchema = createEventSchema.partial();

module.exports = { createEventSchema, updateEventSchema };
