const express = require('express');
const router = express.Router();

const validateBody = require('../middlewares/validateBody');
const auth = require('../middlewares/auth');

const registerUserSchema = require('../schemas/registerUserSchema');
const updateUserSchema = require('../schemas/updateUserSchema'); // ← reste pour /user/:id
const updateProfileSchema = require('../schemas/updateProfileSchema'); // ← utilisé ici

const { registerUser } = require('../controllers/registerUser');
const { loginUser } = require('../controllers/loginUser');
const { getProfile } = require('../controllers/getProfile');
const { updateProfile } = require('../controllers/updateProfile');
const { deleteProfile } = require('../controllers/deleteProfile');

router.post('/register', validateBody(registerUserSchema), registerUser);
router.post('/login', loginUser);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, validateBody(updateProfileSchema), updateProfile); // ← ⬅️ correction ici
router.delete('/profile', auth, deleteProfile);

module.exports = router;
