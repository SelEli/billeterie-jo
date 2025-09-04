# 🛡️ Gateway — Billetterie JO

Service central de routage pour les microservices des Jeux Olympiques. Il assure la redirection sécurisée des requêtes entrantes vers les services métier : Authentification, Réservation, Paiement et Vérification des billets. Ne contient aucune logique métier.

---

## ⚙️ Fonctionnalités

- 🎯 Point d’entrée unique pour le frontend
- 🔐 Middleware de vérification JWT
- 🔁 Redirection dynamique vers les microservices
- 📊 Journalisation des requêtes
- 📡 Intégration Kafka pour la traçabilité
- 🧠 Connexion Redis pour cache ou rate-limiting (optionnel)
- 🧪 Tests automatisés avec Jest + Supertest

---

## 🚀 Démarrage

```bash
npm install
npm run dev
Ou en production :

bash
npm start
📂 Structure du projet
services/gateway/
├── app.js                # App Express
├── server.js             # Démarrage réel
├── routes/               # Routes proxy
├── proxy/                # Création des proxys
├── middlewares/          # Auth + Logger
├── services/             # Kafka + Redis
├── tests/                # Tests Jest
├── .env.example          # Modèle .env
└── package.json
🔐 Fichier .env.example
env
PORT=3000
JWT_SECRET=your_jwt_secret_here
REDIS_URL=redis://localhost:6379
KAFKA_BROKER=localhost:9092
SERVICE_NAME=gateway-service
AUTH_URL=http://localhost:3001
TICKET_SERVICE_URL=http://localhost:3002
PAYMENT_SERVICE_URL=http://localhost:3003
VERIFY_SERVICE_URL=http://localhost:3004
NODE_ENV=development
📋 Routes proxy exposées
Méthode	Route	Cible	Sécurité
POST	/auth/login	→ Auth service	❌
POST	/auth/register	→ Auth service	❌
GET	/tickets/...	→ Ticketing service	✅ JWT
POST	/payment/...	→ Paiement service	✅ JWT
GET	/verify/...	→ Vérification service	✅ JWT
🧪 Tests Jest
bash
npx jest
Vérifie le rejet sans token (401)

Vérifie la réponse proxy de /auth/login

Log console simulé

Pas besoin de lancer les microservices pour tester les routes

📘 Notes techniques
Le Gateway ne valide pas les corps de requête (pas de Zod ici)

Tous les services sont redirigés via http-proxy-middleware

Les logs peuvent être enrichis avec SERVICE_NAME pour Kafka ou Elastic

🔧 Évolutions possibles
Intégrer express-rate-limit + Redis store

Ajouter CORS dynamique par route

Intégrer OpenTelemetry pour tracing

Ajouter authentification OAuth centralisée

✅ Statut
Service prêt, testé, et conforme au CDC. Utiliser server.js pour démarrer en production.