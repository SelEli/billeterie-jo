const fetch = require('node-fetch');

(async () => {
  const res = await fetch('http://localhost:3000/ticketing/ticket/1', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ton_token_jwt_ici'
    }
  });

  const data = await res.json();
  console.log(data);
})();
