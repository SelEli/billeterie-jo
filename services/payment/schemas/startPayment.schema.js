const { z } = require('zod');

const StartPaymentSchema = z.object({
  ticketId: z.number().int().positive(),
  amount: z.number().positive().optional()
});

module.exports = { StartPaymentSchema };
