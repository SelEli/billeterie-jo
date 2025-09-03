// payment-service/server.js
require('dotenv').config();
const express = require('express');
const { initKafka, publishKafkaEvent } = require('./utils/kafkaClient');
const { randomUUID } = require('crypto');

const app = express();
app.use(express.json());

let ready = false;

// Initialisation Kafka
(async () => {
  try {
    await initKafka();
    ready = true;
    console.log('[payment-service] ✅ Kafka connecté et prêt à publier');
  } catch (err) {
    console.error('[payment-service] ❌ Erreur init Kafka:', err);
    process.exit(1);
  }
})();

// Endpoint pour simuler un paiement
app.post('/pay', async (req, res) => {
  if (!ready) {
    return res.status(503).json({ status: 'error', message: 'Kafka non prêt' });
  }

  const { ticketId, amount } = req.body;
  if (!ticketId || typeof ticketId !== 'number') {
    return res.status(400).json({ status: 'error', message: 'ticketId requis (number)' });
  }

  // Ici on pourrait vérifier le montant, la devise, etc.
  console.log(`[payment-service] 💳 Simulation paiement pour ticketId=${ticketId}, montant=${amount || 'N/A'}`);

  // Simuler un délai de traitement
  setTimeout(async () => {
    try {
      await publishKafkaEvent('ticketing', {
        type: 'PaymentConfirmed',
        ticketId,
        transactionId: randomUUID(),
        amount: amount || null,
        confirmedAt: new Date().toISOString()
      });
      console.log(`[payment-service] 📤 Event PaymentConfirmed publié pour ticketId=${ticketId}`);
    } catch (err) {
      console.error('[payment-service] ❌ Erreur publication Kafka:', err);
    }
  }, 1000);

  return res.status(200).json({
    status: 'success',
    message: `Paiement simulé pour ticketId=${ticketId}, event PaymentConfirmed en cours d'envoi`
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`[payment-service] 🚀 Service démarré sur port ${PORT}`);
});
