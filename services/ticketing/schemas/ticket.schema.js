const { z } = require('zod');

/**
 * Schéma pour la création d'un ticket.
 * - userId obligatoire et > 0
 * - eventId et offerId peuvent être null ou absents (nullable().optional())
 * - zone obligatoire (min 1 caractère)
 * - price >= 0 (y compris billets gratuits)
 * - status optionnel dans un ensemble fixé
 */
const TicketCreateSchema = z.object({
  userId: z.number().min(1, { message: 'userId doit être un nombre positif' }),

  eventId: z.number()
    .min(1, { message: 'eventId doit être un nombre positif' })
    .nullable()
    .optional(),

  zone: z.string().min(1, { message: 'zone ne peut pas être vide' }),

  price: z.number().nonnegative({ message: 'price doit être >= 0' }),

  status: z.enum(['RESERVED', 'VALID', 'USED', 'CANCELLED', 'EXPIRED']).optional(),

  offerId: z.number()
    .min(1, { message: 'offerId doit être un nombre positif' })
    .nullable()
    .optional()
});

/**
 * Schéma pour la mise à jour partielle d'un ticket.
 * - Tous les champs de création sont optionnels
 * - On n’exige plus d’`id` dans le body (il est déjà dans l’URL)
 * - On autorise explicitement la mise à jour du champ `status`
 */
const TicketUpdateSchema = TicketCreateSchema.partial().extend({
  status: z.enum(['RESERVED', 'VALID', 'USED', 'CANCELLED', 'EXPIRED']).optional()
});

/**
 * Schéma pour la validation d'un ticket.
 * - ticketId obligatoire, entier > 0
 */
const TicketValidateSchema = z.object({
  ticketId: z.number().min(1, { message: 'ticketId doit être un entier positif' })
});

module.exports = {
  TicketCreateSchema,
  TicketUpdateSchema,
  TicketValidateSchema
};
