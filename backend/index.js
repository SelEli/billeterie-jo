const app = require('./server');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('❌ Erreur au démarrage du serveur :', err.message);
  process.exit(1);
});
