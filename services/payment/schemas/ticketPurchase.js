const { z } = require('zod');

const ticketPurchaseSchema = z.object({
  id_evenement: z.string().uuid({ message: 'Invalid event ID' }),
  prix: z.number().positive({ message: 'Price must be positive' }),
  id_type_billet: z.string().uuid({ message: 'Invalid ticket type ID' }),
  id_offre: z.string().uuid({ message: 'Invalid offer ID' }).optional()
});

module.exports = { ticketPurchaseSchema };