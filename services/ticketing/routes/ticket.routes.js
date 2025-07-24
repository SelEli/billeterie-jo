const express = require('express');

// 🔁 Imports ciblés pour analyse
const ticketRouter = require('./routes/ticket.routes');
const authenticate = require('./middlewares/auth.middleware');
const validateRequest = require('./middlewares/validateRequest.middleware');
const { TicketCreateSchema, TicketUpdateSchema } = require('./schemas/ticket.schema');

// 🔍 Vérification des types
console.log('\n🔎 [TYPE] ticketRouter →', typeof ticketRouter);
console.log('🔎 [TYPE] authenticate →', typeof authenticate);
console.log('🔎 [TYPE] validateRequest →', typeof validateRequest);
console.log('🔎 [TYPE] TicketCreateSchema →', typeof TicketCreateSchema);
console.log('🔎 [TYPE] TicketUpdateSchema →', typeof TicketUpdateSchema);

// 📋 Contenu des objets inspectés
console.log('\n📋 [DIR] authenticate');
console.dir(authenticate, { depth: 2 });

console.log('\n📋 [DIR] validateRequest');
console.dir(validateRequest, { depth: 2 });

console.log('\n📋 [DIR] router');
console.dir(ticketRouter, { depth: 3 });

// 🧪 Test d’enregistrement manuel d’une route Express
const app = express();

try {
  app.use('/debug', ticketRouter);
  app._router.stack.forEach((layer) => {
    if (layer.route && layer.route.path === '/') {
      console.log('\n✅ Route POST `/debug/` enregistrée →', Object.keys(layer.route.methods));
    }
  });
} catch (err) {
  console.error('\n❌ Erreur lors du montage du routeur :', err.message);
  console.error('[STACK]', err.stack);
}
