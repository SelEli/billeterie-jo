const { z } = require('zod');

const logoutSchema = z.object({}).strict(); 
// vide = pas de body attendu

module.exports = logoutSchema;
