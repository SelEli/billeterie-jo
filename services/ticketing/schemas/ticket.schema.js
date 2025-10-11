const { z } = require('zod');

// Enum aligné sur Prisma
const ticketStatuses = ['RESERVED', 'VALID', 'USED', 'CANCELLED', 'EXPIRED'];

// Schéma de base
const ticketBaseSchema = z.object({
  price: z.coerce.number()
    .positive({ message: 'Le prix doit être un nombre positif' }),

  // Zone rendue optionnelle
  zone: z.string().max(100).optional(),

  // Status : optionnel, forcé côté back à RESERVED
  status: z.enum(ticketStatuses).optional(),

  // UserId : obligatoire, mais sera écrasé par req.user côté back
  userId: z.coerce.number()
    .int()
    .positive({ message: 'userId doit être un entier positif' }),

  // EventId : obligatoire via superRefine
  eventId: z.coerce.number().int().positive().optional(),

  // OfferId : optionnel
  offerId: z.coerce.number().int().positive().optional(),

  // secretKey et signature sont générés côté service → pas dans le create
});

// Création
const createTicketSchema = ticketBaseSchema.superRefine((data, ctx) => {
  // Règle métier : un ticket doit être lié à un event
  if (!data.eventId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Un ticket doit être lié à un événement',
      path: ['eventId']
    });
  }
});

// Mise à jour (tous champs optionnels + id obligatoire dans body)
const updateTicketSchema = ticketBaseSchema.partial().extend({
  id: z.preprocess(
    (val) => Number(val),
    z.number().int().positive()
  )
});

// Validation (juste ticketId obligatoire)
const validateTicketSchema = z.object({
  ticketId: z.preprocess(
    (val) => Number(val),
    z.number().int().positive({ message: 'ticketId doit être un entier positif' })
  )
});

module.exports = {
  createTicketSchema,
  updateTicketSchema,
  validateTicketSchema
};
