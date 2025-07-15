const express = require('express');
const router = express.Router();
const { createScan } = require('../controllers/createScan');
const { readScan } = require('../controllers/readScan');
const { updateScan } = require('../controllers/updateScan');
const { deleteScan } = require('../controllers/deleteScan');

router.post('/', createScan);
router.get('/:id', readScan);
router.put('/:id', updateScan);
router.delete('/:id', deleteScan);

module.exports = router;