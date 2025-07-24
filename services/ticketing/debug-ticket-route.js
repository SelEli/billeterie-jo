// debug-ticket-route.js
const ticketRouter = require('./routes/ticket.routes');

console.log('\n[DEBUG] Export du ticketRouter :');
console.dir(ticketRouter, { depth: 3 });
