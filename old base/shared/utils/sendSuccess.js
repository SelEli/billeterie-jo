// utils/sendSuccess.js
const { success } = require('./response');
const { successFrom } = require('./httpSuccessMap');

function sendBusinessSuccess(res, key, payload, meta = {}) {
  const { status, data } = successFrom(key, payload);
  if (status === 204) {
    return res.status(204).end();
  }
  return res.status(status).json(success(data, meta));
}

module.exports = { sendBusinessSuccess };
