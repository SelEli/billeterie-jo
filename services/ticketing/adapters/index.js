// adapters/index.js
// 🎛️ Fabric centralisée des adapters (mock vs endpoint)
// - ADAPTER_MODE=mock | live (global)
// - Surcharges spécifiques possibles (PAYMENT_MODE, VERIFICATION_MODE, KAFKA_MODE)
// - Ne touche pas au code métier : les contrôleurs/services consomment ces adapters

const createPaymentAdapter = require('./payment.adapter');
const createVerificationAdapter = require('./verification.adapter');
const createKafkaAdapter = require('./kafka.adapter');

function resolveMode(globalKey, specificKey) {
  const specific = (process.env[specificKey] || '').toLowerCase();
  if (specific === 'mock' || specific === 'live') return specific;

  const global = (process.env[globalKey] || '').toLowerCase();
  return global === 'mock' || global === 'live' ? global : 'live';
}

function createAdapters() {
  const paymentMode = resolveMode('ADAPTER_MODE', 'PAYMENT_MODE');           // default to global
  const verificationMode = resolveMode('ADAPTER_MODE', 'VERIFICATION_MODE'); // default to global
  const kafkaMode = resolveMode('ADAPTER_MODE', 'KAFKA_MODE');               // default to global

  const payment = createPaymentAdapter({ mode: paymentMode });
  const verification = createVerificationAdapter({ mode: verificationMode });
  const kafka = createKafkaAdapter({ mode: kafkaMode });

  return { payment, verification, kafka };
}

module.exports = { createAdapters };
