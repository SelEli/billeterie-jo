📦 Service Ticketing — Billetterie JO  
Service backend Node.js / Express pour la gestion des tickets, incluant création, lecture, mise à jour, suppression, validation et vérification de billets, avec Zod (validation), Redis (cache), Kafka (événements).

✨ Fonctionnalités  
🎟️ Création, lecture, mise à jour, suppression de tickets  
🔒 Authentification JWT avec gestion de sessions via Redis  
🧑‍💼 Vérification et validation de tickets via Kafka et Payment Service  
🛡️ Validation stricte des payloads avec Zod  
📜 Logs détaillés avec Winston  
🧪 Tests unitaires et d'intégration (Jest + Supertest)

🗂 Architecture  
app.js : app Express, middlewares globaux, montage des routes agrégées  
server.js : démarrage serveur, initialisations éventuelles (Redis, Kafka)  
routes/ : routeur Express pour la gestion des tickets (`ticket.routes.js`)  
controllers/ : logique HTTP pour chaque action de ticket  
services/ : logique métier pour la gestion des tickets  
schemas/ : schémas Zod stricts pour validation  
middlewares/ : middlewares réutilisables (authentification, validation)  
tests/ : tests unitaires et d'intégration pour chaque endpoint  
utils/ : Redis client, Kafka client, logger, helpers  

⚙️ Configuration  
Créer un fichier `.env` à partir de `.env.example` :

```
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379          # optionnel pour cache Redis
KAFKA_BROKERS=localhost:9092              # optionnel pour Kafka
PORT=3000
```

🚀 Installation & Lancement

```
npm install  
npx prisma generate        # génère le client Prisma  
npm run dev                # mode développement  
npm start                  # mode production  
npm test                   # exécute tous les tests  
```

Healthcheck : `GET /health` → `200 OK`

📋 Endpoints API

Tickets

| Méthode | Endpoint          | Description                       | Protection             |  
|--------:|-------------------|-----------------------------------|------------------------|  
| POST    | /tickets           | Créer un ticket                   | ✅ authenticate + validateRequest |  
| GET     | /tickets/:id       | Lire un ticket par ID             | ✅ authenticate         |  
| PUT     | /tickets/:id       | Mettre à jour un ticket           | ✅ authenticate + validateRequest |  
| DELETE  | /tickets/:id       | Supprimer un ticket               | ✅ authenticate         |  
| GET     | /tickets           | Lister tous les tickets           | ✅ authenticate         |  
| POST    | /tickets/validate  | Valider un ticket (via Payment)   | ✅ authenticate         |  
| POST    | /tickets/verify    | Vérifier un ticket (contrôle sur site) | ✅ authenticate         |

📦 Schémas Zod

- `TicketCreateSchema` :

```ts
ticketId: z.number().int().positive(),
eventId: z.number().int().positive(),
userId: z.number().int().positive(),
amount: z.number().positive().optional()
```

- `TicketUpdateSchema` :

```ts
ticketId: z.number().int().positive(),
status: z.enum(['VALID', 'USED', 'CANCELED']),
amount: z.number().positive().optional()
```

🛠 Middlewares

- `authenticate` → décode le JWT et injecte `req.user`  
- `validateRequest(schema)` → valide le corps de la requête avec Zod, retourne 400 si invalide  

🧱 Contrôleurs  

Tickets :  
- `createTicketController`  
- `readTicketController`  
- `updateTicketController`  
- `deleteTicketController`  
- `listTicketsController`  
- `validateTicketController`  
- `verifyTicketController`  

Format de réponse JSON standard :

```
{
  "status": "success|error",
  "data": {},
  "errors": [],
  "meta": {}
}
```

🧪 Tests  

- **Unitaires** : services et contrôleurs mockés  
- **Intégration** : endpoints réels via Supertest, base isolée  
- **Helpers** : `expectErrorShape`, `resetDb`  

Lancer les tests :

```
npm test  
npm run test:watch   # mode watch
```

📊 Rapport de couverture  

Pour générer un rapport de couverture :

```
npm test -- --coverage
```

Un dossier `coverage/` est généré avec un rapport HTML :  
ouvrir `coverage/lcov-report/index.html` dans le navigateur.

📚 Bonnes pratiques appliquées

- Séparation stricte validation → contrôleur → service  
- Middleware `authenticate` centralisé  
- Schémas Zod stricts pour chaque endpoint  
- Importation modulaire et centralisée  
- Gestion des erreurs métier avec helpers (`sendBusinessError`)  
- Logs avec préfixes homogènes (`[TICKET ROUTES]`, `[APP]`)  

🔄 Utilisation de Redis et Kafka

- **Redis** : Utilisé pour le **cache** des ressources fréquentes et limiter la charge sur la base de données.
- **Kafka** : Gère les événements métier, comme la validation de ticket ou l'enregistrement des transactions.

Dans ce service, **Redis et Kafka** ne sont pas utilisés pour l'authentification mais pour la gestion des événements et la performance. Chaque action de ticket peut générer un événement Kafka pour d'autres services (par exemple, `ticket.created`, `ticket.validated`), tandis que Redis est utilisé pour stocker des sessions utilisateur ou d'autres informations temporaires en cache.
