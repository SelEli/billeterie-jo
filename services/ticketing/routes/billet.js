const express = require('express');
const router = express.Router();
const { createBillet } = require('../controllers/createBillet');
const { readBillet } = require('../controllers/readBillet');
const { updateBillet } = require('../controllers/updateBillet');
const { deleteBillet } = require('../controllers/deleteBillet');

router.post('/', createBillet);
router.get('/:id', readBillet);
router.put('/:id', updateBillet);
router.delete('/:id', deleteBillet);

module.exports = router;