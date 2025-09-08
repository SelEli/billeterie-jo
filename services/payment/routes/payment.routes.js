const express = require('express');
const router = express.Router();
const validateRequest = require('../middlewares/validateRequest.middleware');
const { z } = require('zod');

const { startPaymentController } = require('../controllers/startPayment.controller');
const { confirmPaymentController } = require('../controllers/confirmPayment.controller');

const PaymentSchema = z.object({
  ticketId: z.number().int().positive(),
  amount: z.number().positive().optional()
});

router.post('/start', validateRequest(PaymentSchema), startPaymentController);
router.post('/confirm', validateRequest(PaymentSchema), confirmPaymentController);

module.exports = router;
