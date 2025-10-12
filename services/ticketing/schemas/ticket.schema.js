const { z } = require('zod');

// Enum aligné sur Prisma
const ticketStatuses = ['RESERVED', 'VALID', 'USED', 'CANCELLED', 'EXPIRED'];

// Schéma de base
const ticketBaseSchema = z.object({
  // ⚠️ price n’est plus exigé du client, mais on le garde pour compatibilité
  price: z.coerce.number().positive({ message: 'Le prix doit être un nombre positif' }).optional(),

  // Zone optionnelle
  zone: z.string().max(100).optional(),

  // Status optionnel, forcé côté back à RESERVED si absent
  status: z.enum(ticketStatuses).optional(),

  // UserId obligatoire
  userId: z.coerce.number().int().positive({ message: 'userId doit être un entier positif' }),

  // EventId obligatoire via superRefine
  eventId: z.coerce.number().int().positive().optional(),

  // OfferId optionnel
  offerId: z.coerce.number().int().positive().optional(),

  // role optionnel
  role: z.string().optional()
});

// Création
const createTicketSchema = ticketBaseSchema.superRefine((data, ctx) => {
  if (!data.eventId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Un ticket doit être lié à un événement',
      path: ['eventId']
    });
  }
});

// Mise à jour (tous champs optionnels + id obligatoire)
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

module.exports = { createTicketSchema, updateTicketSchema, validateTicketSchema };
