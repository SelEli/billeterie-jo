jest.resetModules(); // On purge le cache des modules
jest.mock('../middlewares/auth.middleware', () => {
  console.log('[MOCK] auth.middleware intercepté par Jest');
  return (req, res, next) => next();
});

jest.mock('../middlewares/validateRequest.middleware', () => {
  console.log('[MOCK] validateRequest.middleware intercepté par Jest');
  return () => (req, res, next) => next();
});

jest.mock('../schemas/ticket.schema', () => {
  console.log('[MOCK] ticket.schema intercepté par Jest');
  return {
    TicketCreateSchema: {},
    TicketUpdateSchema: {}
  };
});

test('📦 Traçage du routeur ticket.routes.js', () => {
  jest.isolateModules(() => {
    const router = require('../routes/ticket.routes.js');

    console.log('\n[TYPE] Export du routeur →', typeof router);
    console.log('[DIR] Contenu du routeur :');
    console.dir(router, { depth: 2 });

    // Test de base : est-ce un routeur Express ?
    expect(typeof router.use).toBe('function');
    expect(typeof router.post).toBe('function');
    expect(typeof router.get).toBe('function');
  });
});
