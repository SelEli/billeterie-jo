# 🎟️ Ticketing Service

Service backend Node.js/Express pour la gestion de tickets, événements et offres, avec Prisma (DB), Zod (validation), Redis (cache) et Kafka (events).

## Fonctionnalités
- CRUD complet pour Tickets, Events, Offers
- Validation Zod
- Authentification JWT
- Cache Redis par ressource
- Événements Kafka sur create/update/delete
- Tests unitaires (services, contrôleurs) et intégration

## Architecture
- app.js : app Express, montage des routes /ticketing/{tickets,events,offers}
- server.js : démarrage serveur + init Redis/Kafka
- routes/ : routes Express par ressource
- controllers/ : logique HTTP par ressource
- services/ : logique métier + Prisma
- schemas/ : schémas Zod
- cache/ : cache Redis ({resource}.cache.js)
- kafka/ : producteurs Kafka
- tests/ : tests service, controller et intégration
- utils/ : prismaClient, redisClient, kafkaClient, etc.

## Configuration
Créer un fichier .env
- DATABASE_URL=postgresql://user:pass@host:5432/db
- JWT_SECRET=your_jwt_secret
- REDIS_URL=redis://localhost:6379
- KAFKA_BROKERS=localhost:9092
- PORT=3001

## Installation
- npm install
- npx prisma generate
- npm run seed (optionnel)

## Lancer
- Dev: npm run dev
- Prod: npm start
- Healthcheck: GET /health → 200 OK

## Endpoints
- Tickets: /ticketing/tickets
  - POST /, GET /:id, GET /, PUT /:id, DELETE /:id
- Events: /ticketing/events
  - POST /, GET /:id, GET /, PUT /:id, DELETE /:id
- Offers: /ticketing/offers
  - POST /, GET /:id, GET /, PUT /:id, DELETE /:id

## Tests
- Tous les tests : npm test
- Couverture : npm run test:cov
- Ticket uniquement : npm run test:ticket
- Event uniquement  : npm run test:event
- Offer uniquement  : npm run test:offer

## Bonnes pratiques
- Séparation stricte validation → controller → service
- Invalidation cache après update/delete
- Vérification des exports de contrôleurs dans les routes
