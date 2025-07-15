const z = require('zod');

const updateProfileSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  })
  .strict(); // ← empêche les champs inattendus

module.exports = updateProfileSchema;
