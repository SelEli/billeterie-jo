const express = require('express');
const router = express.Router();
const { createPaiement } = require('../controllers/createPaiement');
const { readPaiement } = require('../controllers/readPaiement');
const { updatePaiement } = require('../controllers/updatePaiement');
const { deletePaiement } = require('../controllers/deletePaiement');

router.post('/', createPaiement);
router.get('/:id', readPaiement);
router.put('/:id', updatePaiement);
router.delete('/:id', deletePaiement);

module.exports = router;