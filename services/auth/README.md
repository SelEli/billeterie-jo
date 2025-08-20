📦 Service Auth — Billetterie JO
Service backend Node.js / Express pour l’authentification, la gestion des profils et des rôles utilisateurs, avec Prisma (base de données), Zod (validation), Redis (cache optionnel) et Kafka (événements).

✨ Fonctionnalités
🔒 Authentification JWT (login/register)

👤 Gestion de profil utilisateur (CRUD partiel)

🧑‍💼 Gestion complète des utilisateurs par rôle ADMIN

🛡️ Validation stricte des payloads avec Zod

🧪 Tests unitaires (services, contrôleurs) et intégration Jest

📜 Logs unifiés avec Winston

📢 Événements Kafka sur certaines actions

(Optionnel) Cache Redis pour certaines ressources

🗂 Architecture
app.js : app Express, middlewares globaux, montage des routes agrégées

server.js : démarrage serveur, init éventuels (Redis/Kafka)

routes/ : routeurs Express par domaine (auth.routes.js, user.routes.js, role.routes.js, health.js)

controllers/ : logique HTTP par domaine (auth, user, role)

services/ : logique métier + Prisma + Kafka

schemas/ : schémas Zod stricts

middlewares/ : middlewares réutilisables (authenticate, validateRequest)

tests/ : unitaires et intégration par domaine

utils/ : prismaClient, redisClient, logger, kafkaClient, etc.

⚙️ Configuration
Créer un fichier .env à partir de .env.example :

env
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
REDIS_URL=redis://localhost:6379          # optionnel
KAFKA_BROKERS=localhost:9092              # optionnel
PORT=3000
🚀 Installation & Lancement
bash
npm install
npx prisma generate        # génère le client Prisma
npm run dev                # mode dev
npm start                  # mode production
npm test                   # exécute tous les tests
Healthcheck : GET /health → 200 OK

📋 Endpoints API
Authentification
Méthode	Endpoint	Description	Protection
POST	/auth/register	Inscription utilisateur	❌
POST	/auth/login	Connexion + JWT	❌
GET	/auth/profile	Récupérer son profil	✅ authenticate
PUT	/auth/profile	Modifier son profil	✅ authenticate + validateRequest(updateProfileSchema)
DELETE	/auth/profile	Supprimer son compte	✅ authenticate
Utilisateurs (ADMIN)
Méthode	Endpoint	Description	Protection
POST	/user	Créer un utilisateur	✅ authenticate (ADMIN) + validateRequest(createUserSchema)
GET	/user/:id	Lire infos utilisateur	✅ authenticate
PUT	/user/:id	Modifier utilisateur	✅ authenticate (ADMIN) + validateRequest(updateUserSchema)
DELETE	/user/:id	Supprimer utilisateur	✅ authenticate (ADMIN)
PUT	/user/:id/role	Modifier le rôle utilisateur	✅ authenticate (ADMIN) + validateRequest(updateUserRoleSchema)
📦 Schémas Zod
Tous stricts et testés :

registerUserSchema

loginUserSchema

updateProfileSchema (utilisateur connecté)

createUserSchema, updateUserSchema (ADMIN)

updateUserRoleSchema (ADMIN)

🛠 Middlewares
authenticate → décode le JWT et injecte req.user

validateRequest(schema) → valide le corps avec Zod, rejette en 400 si invalide

🧱 Contrôleurs
Auth : registerUser, loginUser, getProfile, updateProfile, deleteProfile

User : createUser, readUser, updateUser, deleteUser

Role : updateUserRole

Gèrent :

Codes HTTP (201, 200, 204, 400, 401, 403, 404, 409, 500)

Format de réponse JSON strict :

json
{
  "status": "success|error",
  "data": {},
  "errors": [],
  "meta": {}
}
Logs clairs et contextualisés

🧪 Tests
Unitaires : contrôleurs et services mockés

Intégration : endpoints réels via Supertest, DB isolée

Helpers communs : expectErrorShape, resetDb

Lancer tous les tests :

bash
npm test
npm run test:watch   # mode watch
📚 Bonnes pratiques appliquées
Séparation stricte validation → contrôleur → service

Vérification des exports de contrôleurs dans chaque route

Imports centralisés via index.js dans middlewares/, controllers/, services/

Couverture des cas d’erreur dans les tests

Préfixes de logs homogènes ([AUTH ROUTES], [USER ROUTES], [ROLE ROUTES], [APP])