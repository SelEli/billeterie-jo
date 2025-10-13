// utils/httpErrorMap.js

const ERROR_STATUS = {
  // --- Champs requis / validation ---
  EMAIL_REQUIRED:              400,
  PASSWORD_REQUIRED:           400,
  ROLE_NAME_REQUIRED:          400,
  MISSING_REQUIRED_FIELDS:     400,
  MISSING_CREDENTIALS:         400,
  INVALID_USER_ID:             400,
  INVALID_ROLE_ID:             400,
  INVALID_TICKET_ID:           400,
  INVALID_TICKET_DATA:         400,
  INVALID_EVENT_ID:            400,
  INVALID_EVENT_DATA:          400,
  INVALID_OFFER_ID:            400,
  INVALID_OFFER_DATA:          400,
  INVALID_QUERY_LIMIT:         400,
  ROLE_REQUIRED:               400,
  INVALID_ROLE:                400,
  INVALID_PERMISSIONS:         400,
  INVALID_TICKET_STATUS:       400,
  EVENT_EXPIRED:               400,
  PAYMENT_NOT_CONFIRMED:       400,
  TICKET_ALREADY_USED:         400, // contrôle d’accès
  TICKET_NOT_VALID:            400, // pas encore VALID
  INVALID_SIGNATURE:           400, // signature QR invalide
  INVALID_ZONE:                400, // zone inexistante
  EVENT_FULL:                  400, // capacité atteinte
  OFFER_INACTIVE:              400, // offre désactivée

  // --- Vérification ---
  START_VERIFICATION_FAILED:   400,
  CONFIRM_VERIFICATION_FAILED: 400,

  // --- Authentification / autorisation ---
  INVALID_PASSWORD:            401,
  UNAUTHORIZED:                401,
  TOKEN_MISSING_OR_MALFORMED:  401,
  FORBIDDEN:                   403,
  USER_KEY_NOT_FOUND:          403,

  // --- Ressources non trouvées ---
  USER_NOT_FOUND:              404,
  ROLE_NOT_FOUND:              404,
  TICKET_NOT_FOUND:            404,
  EVENT_NOT_FOUND:             404,
  OFFER_NOT_FOUND:             404,
  NO_USERS_FOUND:              404,
  NO_ROLES_FOUND:              404,
  NO_EVENTS_FOUND:             404,
  NO_OFFERS_FOUND:             404,

  // --- Conflits / doublons ---
  EMAIL_ALREADY_USED:          409,
  ROLE_EXISTS:                 409,
  EVENT_EXISTS:                409,
  OFFER_EXISTS:                409,

  // --- Erreurs techniques ---
  SERVER_MISCONFIGURATION:     500,
  INTERNAL_SERVER_ERROR:       500
};

function statusFrom(code) {
  if (!Object.prototype.hasOwnProperty.call(ERROR_STATUS, code)) {
    throw new Error(`Unknown business error code: ${code}`);
  }
  return ERROR_STATUS[code];
}

module.exports = { ERROR_STATUS, statusFrom };
