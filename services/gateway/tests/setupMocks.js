// tests/setupMocks.js
require('express')().post('/login', (req, res) => res.json({ token: 'fake.jwt.token' })).listen(3001);
