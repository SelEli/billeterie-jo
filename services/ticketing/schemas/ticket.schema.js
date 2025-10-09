const { z } = require('zod');

// Enum aligné sur Prisma
const ticketStatuses = ['RESERVED', 'VALID', 'USED', 'CANCELLED', 'EXPIRED'];

// Schéma de base
const TicketBaseSchema = z.object({
  price: z.coerce.number()
    .positive({ message: 'Le prix doit être un nombre positif' }),

  zone: z.string().max(100).optional(),

  status: z.enum(ticketStatuses).optional(), // par défaut RESERVED côté Prisma

  userId: z.coerce.number()
    .int()
    .positive({ message: 'userId doit être un entier positif' }),

  eventId: z.coerce.number().int().positive().optional(),
  offerId: z.coerce.number().int().positive().optional(),

  // secretKey et signature sont générés côté service → pas dans le create
});

// Création
const TicketCreateSchema = TicketBaseSchema.superRefine((data, ctx) => {
  // Exemple de règle métier : un ticket doit être lié à un event
  if (!data.eventId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Un ticket doit être lié à un événement',
      path: ['eventId']
    });
  }
});

// Mise à jour (tous champs optionnels + id obligatoire)
const TicketUpdateSchema = TicketBaseSchema.partial().extend({
  id: z.preprocess(
    (val) => Number(val),
    z.number().int().positive()
  )
});

// Validation (juste ticketId obligatoire)
const TicketValidateSchema = z.object({
  ticketId: z.preprocess(
    (val) => Number(val),
    z.number().int().positive({ message: 'ticketId doit être un entier positif' })
  )
});

module.exports = {
  TicketCreateSchema,
  TicketUpdateSchema,
  TicketValidateSchema
};
