# 📦 Service Auth — Billeterie JO

Service d’authentification complet pour la gestion des utilisateurs, connexions, profils et rôles. Inclut validation, tests Jest, logique métier, et sécurisation des routes.

---

## ⚙️ Fonctionnalités principales

- 🔒 Authentification JWT
- 👤 Création & modification de profil utilisateur
- 🧑‍💼 Gestion des utilisateurs par rôle admin
- 🧪 Suite de tests Jest complète
- ✅ Validation stricte avec Zod

---

## 🚀 Démarrage

```bash
npm install
npm run dev   # ou npm start
npx jest      # exécute les tests
📂 Structure du projet
services/auth/
├── app.js
├── controllers/
├── middlewares/
├── schemas/
├── routes/
├── tests/
├── services/
├── .env.example
🔐 Fichier .env.example
env
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
🧪 Tests Jest
register.test.js

Inscription OK / email déjà utilisé / corps invalide

login.test.js

Connexion OK / email inconnu / mauvais mot de passe / champs manquants

profile.test.js

Fetch / update / suppression profil

Rejets pour token absent, user absent, body invalide (.strict())

user.test.js

CRUD utilisateur admin

Rejets si user absent, email déjà utilisé, etc.

📋 Routes API
Authentification
Méthode	Endpoint	Description	Protection
POST	/auth/register	Inscription utilisateur	❌
POST	/auth/login	Connexion et token JWT	❌
GET	/auth/profile	Récupérer profil connecté	✅ auth
PUT	/auth/profile	Modifier profil personnel	✅ auth + validateBody(updateProfileSchema)
DELETE	/auth/profile	Supprimer son compte	✅ auth
Utilisateurs (accès admin)
Méthode	Endpoint	Description	Protection
POST	/user	Créer un utilisateur	❌ (à protéger si besoin)
GET	/user/:id	Lire info utilisateur	✅ auth
PUT	/user/:id	Modifier utilisateur	✅ auth + validateBody(updateUserSchema)
DELETE	/user/:id	Supprimer utilisateur	✅ auth
📦 Schemas Zod
Tous stricts et testés :

registerUserSchema

loginUserSchema

updateUserSchema (admin)

updateProfileSchema (user — .strict())

🛠 Middlewares
validateBody(schema) → parse & rejette corps invalide

auth → décode JWT et injecte req.user

🧱 Contrôleurs
registerUser.js, loginUser.js

getProfile.js, updateProfile.js, deleteProfile.js

createUser.js, updateUser.js, deleteUser.js, readUser.js

Gèrent erreurs, statuts HTTP (400, 401, 404, 409, 500) et publient des logs clairs.

🧪 Scripts utiles (package.json)
json
"scripts": {
  "dev": "nodemon index.js",
  "start": "node index.js",
  "test": "jest",
  "test:watch": "jest --watch"
}
✅ Git Workflow
bash
git add .
git commit -m "✅ Fix tests auth + validation strict profile"
git push origin <branch>
🎯 Couverture des tests
✅ 21 tests réussis

✅ 4 suites validées

✅ Schémas et middleware Zod actifs

✅ Contrôleurs renvoient bons messages & status

📚 À faire / à étendre
Ajouter loginUserSchema (optionnel)

Séparer plus finement les rôles dans les contrôleurs

Générer seed initial de base (seed.js)

Ajouter Swagger ou Postman collection