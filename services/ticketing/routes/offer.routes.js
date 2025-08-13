// routes/offer.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');

router.post('/offers', auth, require('../controllers/offer/createOffer.controller'));
router.get('/offers/:id', require('../controllers/offer/readOffer.controller'));
router.get('/offers', require('../controllers/offer/listOffers.controller'));
router.put('/offers/:id', auth, require('../controllers/offer/updateOffer.controller'));
router.delete('/offers/:id', auth, require('../controllers/offer/deleteOffer.controller'));

module.exports = router;
