// ⛔️ Ne surtout pas mocker le middleware d'auth ici — il doit être exécuté réellement !
// ❌ SUPPRIME si jamais ajouté :
// jest.mock('../middlewares/auth.middleware', () => (req, res, next) => next());

// ✅ Mock du middleware de validation — OK si on ne teste pas le schéma en détail
jest.mock('../middlewares/validateRequest.middleware', () => (schema) => (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Missing or invalid request body' });
  }
  req.validated = req.body;
  next();
});

// ✅ Mock des schémas — Ticket
jest.mock('../schemas/ticket.schema', () => ({
  TicketCreateSchema: {},
  TicketUpdateSchema: {}
}));

// ✅ Mock des schémas — Event
jest.mock('../schemas/event.schema', () => ({
  EventCreateSchema: {},
  EventUpdateSchema: {}
}));

// ✅ Mock des schémas — Offer
jest.mock('../schemas/offer.schema', () => ({
  OfferCreateSchema: {},
  OfferUpdateSchema: {}
}));

// ✅ Mock du client Redis avec cache en mémoire unique pour tous
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

// ✅ Mock Kafka Ticket
jest.mock('../kafka/ticket.kafka.js', () => ({
  emitTicketCreated: jest.fn(async () => Promise.resolve()),
  emitTicketUpdated: jest.fn(async () => Promise.resolve()),
  emitTicketDeleted: jest.fn(async () => Promise.resolve())
}));

// ✅ Mock Kafka Event
jest.mock('../kafka/event.kafka.js', () => ({
  emitEventCreated: jest.fn(async () => Promise.resolve()),
  emitEventUpdated: jest.fn(async () => Promise.resolve()),
  emitEventDeleted: jest.fn(async () => Promise.resolve())
}));

// ✅ Mock Kafka Offer
jest.mock('../kafka/offer.kafka.js', () => ({
  emitOfferCreated: jest.fn(async () => Promise.resolve()),
  emitOfferUpdated: jest.fn(async () => Promise.resolve()),
  emitOfferDeleted: jest.fn(async () => Promise.resolve())
}));
