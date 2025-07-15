const express = require('express');
const router = express.Router();
const auth = require('../middlewares');
const validateBody = require('../middlewares');

const { registerUser } = require('../controllers/registerUser');
const { loginUser } = require('../controllers/loginUser');
const { getProfile } = require('../controllers/getProfile');
const { updateProfile } = require('../controllers/updateProfile');
const { deleteProfile } = require('../controllers/deleteProfile');

const { registerUserSchema } = require('../schemas/registerUserSchema');
const { updateUserSchema } = require('../schemas/updateUserSchema');

router.post('/register', validateBody(registerUserSchema), registerUser);
router.post('/login', loginUser);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, validateBody(updateUserSchema), updateProfile);
router.delete('/profile', auth, deleteProfile);

module.exports = router;
