const { z } = require('zod');

/**
 * Schéma pour la création d'un ticket.
 * Champs obligatoires : userId, eventId, zone, price.
 * status est optionnel.
 * offerId est optionnel et nullable.
 */
const TicketCreateSchema = z.object({
  userId: z.number().min(1, { message: 'userId doit être un nombre positif' }),
  eventId: z.number().min(1, { message: 'eventId doit être un nombre positif' }),
  zone: z.string().min(1, { message: 'zone ne peut pas être vide' }),
  price: z.number().min(1, { message: 'price doit être >= 1' }),
  status: z.enum(['RESERVED', 'VALID', 'USED', 'CANCELLED', 'EXPIRED']).optional(),
  offerId: z.number().nullable().optional(),
});

/**
 * Schéma pour la mise à jour partielle d'un ticket.
 * Tous les champs sont optionnels sauf l'id.
 * id est obligatoire, string numérique transformée en nombre.
 */
const TicketUpdateSchema = TicketCreateSchema
  .partial()
  .extend({
    id: z.string()
      .regex(/^\d+$/, { message: 'id doit être une chaîne numérique' })
      .transform(Number),
  });

module.exports = { TicketCreateSchema, TicketUpdateSchema };
