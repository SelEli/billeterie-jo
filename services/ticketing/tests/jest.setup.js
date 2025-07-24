jest.mock('../middlewares/auth.middleware', () => (req, res, next) => next());
jest.mock('../middlewares/validateRequest.middleware', () => () => (req, res, next) => next());
jest.mock('../schemas/ticket.schema', () => ({
  TicketCreateSchema: {},
  TicketUpdateSchema: {}
}));
jest.mock('../utils/redisClient', () => ({
  getRedis: () => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn()
  })
}));
jest.mock('../kafka/ticket.kafka.js', () => ({
  emitTicketCreated: jest.fn()
}));
