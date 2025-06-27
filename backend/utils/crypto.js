const crypto = require('crypto');

function genererCleInvisible() {
  return crypto.randomBytes(32).toString('hex');
}

function genererCleAchat() {
  return crypto.randomBytes(20).toString('hex');
}

module.exports = {
  genererCleInvisible,
  genererCleAchat
};
