🎟️ Service Ticketing — Billetterie JO
Service backend Node.js / Express pour la gestion des tickets, événements et offres, intégrant Prisma (base de données), Zod (validation stricte), Redis (cache), et Kafka (événements).

✨ Fonctionnalités
🎫 CRUD complet pour Tickets, Events, Offers

🛡️ Validation stricte des payloads avec Zod

🔒 Authentification JWT

⚡ Cache Redis par ressource

📢 Événements Kafka sur création / mise à jour / suppression

🧪 Tests unitaires (services, contrôleurs) et intégration

📜 Logs homogènes et contextualisés

🗂 Architecture
app.js : app Express, middlewares globaux, montage routes agrégées

server.js : démarrage serveur + initialisation Redis / Kafka

routes/ : routeurs Express par ressource (tickets.routes.js, events.routes.js, offers.routes.js, health.js)

controllers/ : logique HTTP par ressource

services/ : logique métier + Prisma + publication Kafka

schemas/ : schémas Zod stricts

cache/ : modules d’accès et invalidation Redis par ressource

middlewares/ : middlewares transverses (authenticate, validateRequest)

tests/ : unitaires et intégration

utils/ : prismaClient, redisClient, logger, kafkaClient, etc.

⚙️ Configuration
Créer un fichier .env à partir de .env.example :

env
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
KAFKA_BROKERS=localhost:9092
PORT=3001
🚀 Installation & Lancement
bash
npm install
npx prisma generate
npm run dev     # mode développement
npm start       # mode production
npm test        # lancer tous les tests
Healthcheck : GET /health → 200 OK

📋 Endpoints API
🎫 Tickets
Méthode	Endpoint	Description	Protection
POST	/ticketing/tickets	Créer un ticket	✅ authenticate
GET	/ticketing/tickets/:id	Lire un ticket	✅ authenticate
GET	/ticketing/tickets	Lister les tickets	✅ authenticate
PUT	/ticketing/tickets/:id	Mettre à jour un ticket	✅ authenticate
DELETE	/ticketing/tickets/:id	Supprimer un ticket	✅ authenticate
🎤 Events
Méthode	Endpoint	Description	Protection
POST	/ticketing/events	Créer un événement	✅ authenticate
GET	/ticketing/events/:id	Lire un événement	✅ authenticate
GET	/ticketing/events	Lister les événements	✅ authenticate
PUT	/ticketing/events/:id	Mettre à jour un événement	✅ authenticate
DELETE	/ticketing/events/:id	Supprimer un événement	✅ authenticate
💰 Offers
Méthode	Endpoint	Description	Protection
POST	/ticketing/offers	Créer une offre	✅ authenticate
GET	/ticketing/offers/:id	Lire une offre	✅ authenticate
GET	/ticketing/offers	Lister les offres	✅ authenticate
PUT	/ticketing/offers/:id	Mettre à jour une offre	✅ authenticate
DELETE	/ticketing/offers/:id	Supprimer une offre	✅ authenticate
📦 Schémas Zod
Tous stricts et testés :

ticketSchema

eventSchema

offerSchema

🛠 Middlewares
authenticate → vérifie le JWT et injecte req.user

validateRequest(schema) → valide le corps de requête avec Zod

🧱 Contrôleurs
Tickets : createTicket, getTicket, listTickets, updateTicket, deleteTicket

Events : createEvent, getEvent, listEvents, updateEvent, deleteEvent

Offers : createOffer, getOffer, listOffers, updateOffer, deleteOffer

Tous renvoient :

json
{
  "status": "success|error",
  "data": {},
  "errors": [],
  "meta": {}
}
Avec codes HTTP cohérents et logs clairs.

🧪 Tests
Unitaires : contrôleurs et services mockés

Intégration : endpoints réels, base de test isolée

Commandes :

bash
npm test
npm run test:watch
📚 Bonnes pratiques
Séparation stricte validation → contrôleur → service

Imports centralisés via index.js pour middlewares, contrôleurs et services

Vérification stricte des exports de contrôleurs dans les routes

Invalidation du cache Redis après update/delete

Publication Kafka sur chaque mutation