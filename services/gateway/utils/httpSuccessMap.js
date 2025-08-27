// utils/httpSuccessMap.js

const SUCCESS_STATUS = {
  // --- CREATE ---
  CREATE_USER:  { status: 201, wrap: (payload) => payload },
  CREATE_AUTH:  { status: 201, wrap: (payload) => payload },
  CREATE_ROLE:  { status: 201, wrap: (payload) => payload },

  // --- AUTH / SESSION ---
  LOGIN:        { status: 200, wrap: (payload) => payload },
  LOGOUT:       { status: 200, wrap: (payload) => payload },

  // --- READ ---
  READ_ONE:        { status: 200, wrap: (payload) => payload },
  READ_LIST:       { status: 200, wrap: (payload) => payload },
  READ_ROLE:       { status: 200, wrap: (payload) => payload },       // ajouté
  READ_ROLE_LIST:  { status: 200, wrap: (payload) => payload },       // ajouté

  // --- UPDATE ---
  UPDATE_USER:     { status: 200, wrap: (payload) =>  payload },
  UPDATE_PROFILE:  { status: 200, wrap: (payload) => payload },
  UPDATE_ROLE:     { status: 200, wrap: (payload) => payload },

  // --- DELETE ---
  DELETE:       { status: 204, wrap: () => null },
  DELETE_USER:  { status: 204, wrap: () => null },
  DELETE_ROLE:  { status: 200, wrap: (payload) => payload } // modifié pour 200 + body
};

function successFrom(key, payload) {
  if (!Object.prototype.hasOwnProperty.call(SUCCESS_STATUS, key)) {
    throw new Error(`Unknown success key: ${key}`);
  }
  const { status, wrap } = SUCCESS_STATUS[key];
  return { status, data: wrap(payload) };
}

module.exports = { SUCCESS_STATUS, successFrom };

