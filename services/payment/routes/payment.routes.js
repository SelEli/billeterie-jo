const express = require('express');
const router = express.Router();
const validateRequest = require('../middlewares/validateRequest.middleware');
const authenticate = require('../middlewares/auth.middleware'); // 🔑 importe ton middleware
const { z } = require('zod');

const { startPaymentController } = require('../controllers/startPayment.controller');
const { confirmPaymentController } = require('../controllers/confirmPayment.controller');

const PaymentSchema = z.object({
  ticketId: z.number().int().positive(),
  amount: z.number().positive().optional()
});

// START
router.post(
  '/start',
  authenticate,                 // 👈 ajoute ici
  validateRequest(PaymentSchema),
  startPaymentController
);

// CONFIRM
router.post(
  '/confirm',
  authenticate,                 // 👈 et ici aussi
  validateRequest(PaymentSchema),
  confirmPaymentController
);

module.exports = router;
