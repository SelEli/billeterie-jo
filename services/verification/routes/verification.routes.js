const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth.middleware');
const validateRequest = require('../middlewares/validateRequest.middleware');
const { z } = require('zod');

const { startVerificationController } = require('../controllers/startVerification.controller');
// const { confirmVerificationController } = require('../controllers/confirmVerification.controller');

// Schéma pour startVerification
const StartVerificationSchema = z.object({
  ticketId: z.number().int().positive()
});

// Schéma simplifié pour confirmVerification (désactivé)
// const ConfirmVerificationSchema = z.object({
//   ticketId: z.number().int().positive(),
//   userId: z.number().int().positive(),
//   signature: z.string().min(1),
//   status: z.enum(['USED', 'VALID'])
// });

// START
router.post(
  '/start',
  authenticate,
  validateRequest(StartVerificationSchema),
  startVerificationController
);

// CONFIRM (désactivé)
// router.post(
//   '/confirm',
//   authenticate,
//   validateRequest(ConfirmVerificationSchema),
//   confirmVerificationController
// );

module.exports = router;
