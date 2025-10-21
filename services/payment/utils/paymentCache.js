// utils/paymentCache.js
const cache = new Map(); // ticketId -> { amount, startedAt, mode }

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

function setPaymentData(ticketId, { amount, mode = 'live' }) {
  const numericId = Number(ticketId);
  if (Number.isNaN(numericId)) throw new Error(`Invalid ticketId: ${ticketId}`);

  cache.set(numericId, {
    amount,
    startedAt: Date.now(),
    mode
  });
}

function getPaymentData(ticketId) {
  const numericId = Number(ticketId);
  const entry = cache.get(numericId);
  if (!entry) return null;

  // TTL check
  if (Date.now() - entry.startedAt > DEFAULT_TTL_MS) {
    cache.delete(numericId);
    return null;
  }
  return entry;
}

function clearPaymentData(ticketId) {
  cache.delete(Number(ticketId));
}

module.exports = { setPaymentData, getPaymentData, clearPaymentData };
