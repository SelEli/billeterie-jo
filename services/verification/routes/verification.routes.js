const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate.middleware');
const validateRequest = require('../middlewares/validateRequest.middleware');
const { z } = require('zod');

const { startVerificationController } = require('../controllers/startVerification.controller');
const { confirmVerificationController } = require('../controllers/confirmVerification.controller');

// Schéma pour startVerification
const StartVerificationSchema = z.object({
  ticketId: z.number().int().positive()
});

// Schéma pour confirmVerification
const ConfirmVerificationSchema = z.object({
  ticketId: z.number().int().positive(),
  eventId: z.number().int().positive(),
  userId: z.number().int().positive(),
  zone: z.string().min(1),
  price: z.number().positive(),
  issuedAt: z.string().min(1),
  signature: z.string().min(1)
});

// START
router.post(
  '/start',
  authenticate,
  validateRequest(StartVerificationSchema),
  startVerificationController
);

// CONFIRM
router.post(
  '/confirm',
  authenticate,
  validateRequest(ConfirmVerificationSchema),
  confirmVerificationController
);

module.exports = router;
