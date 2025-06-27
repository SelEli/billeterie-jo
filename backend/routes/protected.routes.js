const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth.middleware');

router.get('/', verifyToken, (req, res) => {
  res.status(200).json({ message: `Bienvenue ${req.user.nom || 'utilisateur'}` });
});

module.exports = router;
