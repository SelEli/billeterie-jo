// utils/httpErrorMap.js

const ERROR_STATUS = {
  // --- Champs requis / validation ---
  EMAIL_REQUIRED:           400,
  PASSWORD_REQUIRED:        400,
  ROLE_NAME_REQUIRED:       400, // nom de rôle manquant (createRole)
  MISSING_REQUIRED_FIELDS:  400,
  MISSING_CREDENTIALS:      400,
  INVALID_USER_ID:          400,
  INVALID_ROLE_ID:          400,
  INVALID_QUERY_LIMIT:      400,
  ROLE_REQUIRED:            400,
  INVALID_ROLE:             400,
  INVALID_PERMISSIONS:      400, // format permissions invalide (createRole)

  // --- Authentification / autorisation ---
  INVALID_PASSWORD:         401,
  UNAUTHORIZED:             401,
  TOKEN_MISSING_OR_MALFORMED: 401, // token absent ou mal formé
  FORBIDDEN:                403,

  // --- Ressources non trouvées ---
  USER_NOT_FOUND:           404,
  ROLE_NOT_FOUND:           404,
  NO_USERS_FOUND:           404,
  NO_ROLES_FOUND:           404,

  // --- Conflits / doublons ---
  EMAIL_ALREADY_USED:       409,
  ROLE_EXISTS:              409,

  // --- Erreurs techniques ---
  SERVER_MISCONFIGURATION:  500, // JWT_SECRET manquant ou config serveur invalide
  INTERNAL_SERVER_ERROR:    500
};

function statusFrom(code) {
  if (!Object.prototype.hasOwnProperty.call(ERROR_STATUS, code)) {
    throw new Error(`Unknown business error code: ${code}`);
  }
  return ERROR_STATUS[code];
}

module.exports = { ERROR_STATUS, statusFrom };
