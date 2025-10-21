// utils/httpSuccessMap.js

const SUCCESS_STATUS = {
  // --- CREATE ---
  CREATE_USER:     { status: 201, wrap: (payload) => payload },
  CREATE_AUTH:     { status: 201, wrap: (payload) => payload },
  CREATE_ROLE:     { status: 201, wrap: (payload) => payload },
  CREATE_TICKET:   { status: 201, wrap: (payload) => payload },
  CREATE_EVENT:    { status: 201, wrap: (payload) => payload },
  CREATE_OFFER:    { status: 201, wrap: (payload) => payload },

  // --- AUTH / SESSION ---
  LOGIN:           { status: 200, wrap: (payload) => payload },
  LOGOUT:          { status: 200, wrap: (payload) => payload },

  // --- READ ---
  READ_ONE:        { status: 200, wrap: (payload) => payload },
  READ_LIST:       { status: 200, wrap: (payload) => payload },
  READ_ROLE:       { status: 200, wrap: (payload) => payload },
  READ_ROLE_LIST:  { status: 200, wrap: (payload) => payload },
  READ_EVENT:      { status: 200, wrap: (payload) => payload },
  READ_EVENT_LIST: { status: 200, wrap: (payload) => payload },
  READ_OFFER:      { status: 200, wrap: (payload) => payload },
  READ_OFFER_LIST: { status: 200, wrap: (payload) => payload },

  // --- UPDATE ---
  UPDATE_USER:     { status: 200, wrap: (payload) => payload },
  UPDATE_PROFILE:  { status: 200, wrap: (payload) => payload },
  UPDATE_ROLE:     { status: 200, wrap: (payload) => payload },
  UPDATE_TICKET:   { status: 200, wrap: (payload) => payload },
  UPDATE_EVENT:    { status: 200, wrap: (payload) => payload },
  UPDATE_OFFER:    { status: 200, wrap: (payload) => payload },
  UPDATE_TICKET_STATUS: { status: 200, wrap: (payload) => payload },
  VALIDATE_TICKET: { status: 200, wrap: (payload) => payload },
  VERIFY_TICKET:   { status: 200, wrap: (payload) => payload },

  // --- VERIFICATION ---
  START_VERIFICATION:       { status: 200, wrap: (payload) => payload },
  CONFIRM_VERIFICATION:     { status: 200, wrap: (payload) => payload },
  VERIFY_TICKET_REQUESTED:  { status: 200, wrap: (payload) => payload },

  // --- DELETE ---
  DELETE:          { status: 204, wrap: () => null },
  DELETE_USER:     { status: 204, wrap: () => null },
  DELETE_ROLE:     { status: 200, wrap: (payload) => payload },
  DELETE_TICKET:   { status: 204, wrap: () => null },
  DELETE_EVENT:    { status: 204, wrap: () => null },
  DELETE_OFFER:    { status: 204, wrap: () => null }
};

function successFrom(key, payload) {
  if (!Object.prototype.hasOwnProperty.call(SUCCESS_STATUS, key)) {
    throw new Error(`Unknown success key: ${key}`);
  }
  const { status, wrap } = SUCCESS_STATUS[key];
  return { status, data: wrap(payload) };
}

module.exports = { SUCCESS_STATUS, successFrom };
