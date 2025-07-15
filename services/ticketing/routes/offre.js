const express = require('express');
const router = express.Router();
const { createOffre } = require('../controllers/createOffre');
const { readOffre } = require('../controllers/readOffre');
const { updateOffre } = require('../controllers/updateOffre');
const { deleteOffre } = require('../controllers/deleteOffre');

router.post('/', createOffre);
router.get('/:id', readOffre);
router.put('/:id', updateOffre);
router.delete('/:id', deleteOffre);

module.exports = router;