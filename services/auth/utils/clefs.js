const crypto = require('crypto');

function genererClef() {
  return crypto.randomBytes(16).toString('hex');
}

function combinerClefs(clefUtilisateur, clefAchat) {
  const secret = process.env.CLEF_SIGNATURE_SECRET || 'secret-signature';
  return crypto
    .createHmac('sha256', secret)
    .update(clefUtilisateur + clefAchat)
    .digest('hex');
}

function verifierClefs(clefCombinee, clefUtilisateur, clefAchat) {
  return combinerClefs(clefUtilisateur, clefAchat) === clefCombinee;
}

module.exports = { genererClef, combinerClefs, verifierClefs };