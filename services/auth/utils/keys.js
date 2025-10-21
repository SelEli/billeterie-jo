// utils/keys.js
const crypto = require('crypto');

/**
 * Generate a random invisible key for a user
 * @returns {string} - A unique, non‑guessable key
 */
function generateInvisibleKey() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Combine two keys (e.g., user key + purchase key) into a signed hash
 * @param {string} userKey
 * @param {string} purchaseKey
 * @returns {string} - Combined HMAC signature
 */
function combineKeys(userKey, purchaseKey) {
  const secret = process.env.CLEF_SIGNATURE_SECRET || 'secret-signature';
  return crypto
    .createHmac('sha256', secret)
    .update(userKey + purchaseKey)
    .digest('hex');
}

/**
 * Verify that a combined key matches the expected signature
 * @param {string} combinedKey
 * @param {string} userKey
 * @param {string} purchaseKey
 * @returns {boolean}
 */
function verifyKeys(combinedKey, userKey, purchaseKey) {
  return combineKeys(userKey, purchaseKey) === combinedKey;
}

module.exports = { generateInvisibleKey, combineKeys, verifyKeys };
