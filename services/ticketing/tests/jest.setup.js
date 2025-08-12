// ⛔️ Ne surtout pas mocker le middleware d'auth ici — il doit être exécuté réellement !
// ❌ SUPPRIME :
// jest.mock('../middlewares/auth.middleware', () => (req, res, next) => next());

// ✅ Mock du middleware de validation — OK si on ne teste pas le schéma en détail
jest.mock('../middlewares/validateRequest.middleware', () => (schema) => (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Missing or invalid request body' });
  }
  req.validated = req.body;
  next();
});

// ✅ Mock des schémas — OK si tu veux ignorer les validations précises
jest.mock('../schemas/ticket.schema', () => ({
  TicketCreateSchema: {},
  TicketUpdateSchema: {}
}));

// ✅ Mock du client Redis avec cache en mémoire
jest.mock('../utils/redisClient', () => {
  const cache = new Map();

  return {
    getRedis: () => ({
      get: jest.fn(async (key) => cache.get(key) || null),
      set: jest.fn(async (key, value, mode, duration) => {
        cache.set(key, value);
        return 'OK';
      }),
      del: jest.fn(async (key) => {
        const existed = cache.delete(key);
        return existed ? 1 : 0;
      }),
      _cache: cache
    })
  };
});

// ✅ Mock Kafka — pas besoin d’envoyer de vrais events
jest.mock('../kafka/ticket.kafka.js', () => ({
  emitTicketCreated: jest.fn(async (_ticket) => Promise.resolve()),
  emitTicketUpdated: jest.fn(async (_ticket) => Promise.resolve()),
  emitTicketDeleted: jest.fn(async (_id) => Promise.resolve())
}));
