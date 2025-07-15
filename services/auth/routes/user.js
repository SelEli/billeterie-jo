const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const validateBody = require('../middlewares/validateBody');

const createUserSchema = require('../schemas/createUserSchema');
const updateUserSchema = require('../schemas/updateUserSchema');
const updateProfileSchema = require('../schemas/updateProfileSchema');

const { createUser } = require('../controllers/createUser');
const { readUser } = require('../controllers/readUser');
const { updateUser } = require('../controllers/updateUser');
const { deleteUser } = require('../controllers/deleteUser');

router.post('/', validateBody(createUserSchema), createUser);
router.get('/:id', auth, readUser);
router.put('/:id', auth, validateBody(updateUserSchema), updateUser);
router.delete('/:id', auth, deleteUser);

module.exports = router;
