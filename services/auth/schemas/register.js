const { z } = require('zod');

const registerSchema = z.object({
  nom: z.string().min(2),
  prenom: z.string().min(2),
  email: z.string().email(),
  mot_de_passe: z.string().min(8)
});

module.exports = { registerSchema };