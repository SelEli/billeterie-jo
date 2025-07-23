const { z } = require('zod');

const TicketCreateSchema = z.object({
  userId: z.number().optional(),
  eventId: z.number().nullable().optional(),
  offerId: z.number().nullable().optional(),
  zone: z.string().optional(),
  price: z.number().min(0),
  status: z.enum(['RESERVED','VALID','USED','CANCELLED','EXPIRED']).optional()
});

const TicketUpdateSchema = TicketCreateSchema.extend({
  eventId: z.number().nullable().optional(),
  offerId: z.number().nullable().optional()
}).partial().extend({
  id: z.string().regex(/^\d+$/).transform(Number)
});

module.exports = { TicketCreateSchema, TicketUpdateSchema };
