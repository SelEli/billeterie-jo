const express = require('express');
const router = express.Router();
const { createEvenement } = require('../controllers/createEvenement');
const { readEvenement } = require('../controllers/readEvenement');
const { updateEvenement } = require('../controllers/updateEvenement');
const { deleteEvenement } = require('../controllers/deleteEvenement');

router.post('/', createEvenement);
router.get('/:id', readEvenement);
router.put('/:id', updateEvenement);
router.delete('/:id', deleteEvenement);

module.exports = router;