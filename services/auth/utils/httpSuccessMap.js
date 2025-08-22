// utils/httpSuccessMap.js
const SUCCESS_STATUS = {
  CREATE_USER: { status: 201, wrap: (payload) => payload }, // data = user
  CREATE_AUTH: { status: 201, wrap: (payload) => payload }, // data = { token, user }
  READ_ONE: { status: 200, wrap: (payload) => payload },    // data = user
  READ_LIST: { status: 200, wrap: (payload) => payload },   // data = user[]
  UPDATE_USER: { status: 200, wrap: (payload) => ({ user: payload }) },
  UPDATE_PROFILE: { status: 200, wrap: (payload) => payload }, // data = user
  UPDATE_ROLE: { status: 200, wrap: (payload) => payload },    // data = { role: 'ADMIN' }
  LOGOUT: { status: 200, wrap: (payload) => payload },         // data = { message: ... }
  DELETE: { status: 204, wrap: () => null }                    // pas de body
};

function successFrom(key, payload) {
  if (!SUCCESS_STATUS.hasOwnProperty(key)) {
    throw new Error(`Unknown success key: ${key}`);
  }
  const { status, wrap } = SUCCESS_STATUS[key];
  return { status, data: wrap(payload) };
}

module.exports = { SUCCESS_STATUS, successFrom };
