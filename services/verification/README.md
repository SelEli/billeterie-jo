📦 Service Verification — Contrôle Billetterie JO  
Service backend Node.js / Express pour démarrer la vérification de billets, avec validation des payloads via Zod, authentification JWT, et logs unifiés.

✨ Fonctionnalités  
🎟️ Démarrage de la vérification de ticket (`/start`)  
🔒 Authentification requise pour toutes les routes  
🛡️ Validation stricte des payloads avec Zod  
📜 Logs unifiés avec Winston  
🧪 Tests unitaires et d’intégration (Jest + Supertest)  

🗂 Architecture  
app.js : app Express, middlewares globaux, montage des routes agrégées  
server.js : démarrage serveur, initialisations éventuelles  
routes/ : routeur Express pour la vérification (`verification.routes.js`)  
controllers/ : logique HTTP (`startVerification`)  
services/ : logique métier (startVerificationService)  
schemas/ : schémas Zod stricts  
middlewares/ : middlewares réutilisables (`authenticate`, `validateRequest`)  
tests/ : unitaires et intégration par domaine  
utils/ : logger, helpers d'erreur et de succès  

⚙️ Configuration  
Créer un fichier `.env` à partir de `.env.example` :

```
# Port et host
PORT=8080
HOST=127.0.0.1

# Base de données fictive
DATABASE_URL=postgresql://user:password@fake-db:5432/fakeauth

# JWT bidon
JWT_SECRET=SuperSecretKey123!
JWT_EXPIRES_IN=2h
REFRESH_TOKEN_SECRET=AnotherSecretKey456!
REFRESH_TOKEN_EXPIRES_IN=14d

# Redis bidon
REDIS_URL=redis://fake-redis:6380

# Kafka bidon
KAFKA_BROKER=fake-kafka:9093

# Service
SERVICE_NAME=auth-fake-service
NODE_ENV=development
LOG_LEVEL=debug

# Endpoints fictifs
AUTH_URL=http://fake-gateway/auth
TICKETING_URL=http://fake-gateway/ticketing
PAYMENT_URL=http://fake-gateway/payment
VERIFICATION_URL=http://fake-gateway/verification

# Callback fictif
VERIFY_CALLBACK_URL=http://fake-gateway/verify-callback

# Switch global Adapters
ADAPTER_MODE=test
PAYMENT_MODE=mock
VERIFICATION_MODE=stub
KAFKA_MODE=disabled

# Choix endpoint vs logique interne
USE_EXTERNAL_PAYMENT=false
USE_EXTERNAL_VERIFICATION=true

```

🚀 Installation & Lancement

```
npm install  
npm run dev                # mode développement  
npm start                  # mode production  
npm test                   # exécute tous les tests  
```

Healthcheck : `GET /health` → `200 OK`

📋 Endpoints API  

Vérification

| Méthode | Endpoint           | Description                      | Protection           |  
|--------:|--------------------|----------------------------------|----------------------|  
| POST    | /verification/start | Démarrer la vérification d’un ticket | ✅ authenticate + validateRequest |

📦 Schémas Zod  

- `StartVerificationSchema` :

```
ticketId: number (entier positif)
```

🛠 Middlewares  

- `authenticate` → décode le JWT et injecte `req.user`  
- `validateRequest(schema)` → valide le corps de la requête avec Zod, retourne 400 si invalide  

🧱 Contrôleurs  

Verification :  
- `startVerificationController`  
- `confirmVerificationController` *(désactivé)*

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
- Logs avec préfixes homogènes (`[START VERIFICATION CTRL]`, `[APP]`)  
