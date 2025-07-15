// routes/auth.js
const { baseUserSchema } = require('../schemas/baseUserSchema');
const registerUserSchema = baseUserSchema.omit({ role: true });

// routes/user.js
const createUserSchema = baseUserSchema.extend({ role: baseUserSchema.shape.role });
const updateUserSchema = baseUserSchema.partial();
