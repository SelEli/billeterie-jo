const http = require('http');

const services = {
  auth: 3001,
  paiement: 3003,
  ticketing: 3002,
  verification: 3004,
  gateway: 3000
};

for (const [name, port] of Object.entries(services)) {
  const options = {
    hostname: 'localhost',
    port,
    path: '/api/health',
    method: 'GET'
  };

  const req = http.request(options, res => {
    let data = '';
    res.on('data', chunk => (data += chunk));
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        console.log(`✅ [${name}] Health OK →`, json);
      } catch {
        console.log(`❌ [${name}] Health NON JSON →`, data);
      }
    });
  });

  req.on('error', () => {
    console.log(`❌ [${name}] Health DOWN`);
  });

  req.end();
}
