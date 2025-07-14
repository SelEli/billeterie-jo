const { z } = require('zod');

const scanSchema = z.object({
  qr_code: z.string().min(20)
});

module.exports = { scanSchema };