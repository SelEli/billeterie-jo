// utils/sendError.js
const { error } = require('./response');
const { statusFrom } = require('./httpErrorMap');

function sendBusinessError(res, code) {
  return res.status(statusFrom(code)).json(error([code]));
}

module.exports = { sendBusinessError };
