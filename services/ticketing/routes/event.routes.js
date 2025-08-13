const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');

router.post('/events', auth, require('../controllers/event/createEvent.controller'));
router.get('/events/:id', require('../controllers/event/readEvent.controller'));
router.get('/events', require('../controllers/event/listEvents.controller'));
router.put('/events/:id', auth, require('../controllers/event/updateEvent.controller'));
router.delete('/events/:id', auth, require('../controllers/event/deleteEvent.controller'));

module.exports = router;
