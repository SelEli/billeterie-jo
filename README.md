# 🏟️ Billetterie JO 2024 — README complet

Architecture modulaire orientée microservices pour gérer l’authentification, la réservation, le paiement sécurisé, la traçabilité, la génération et la vérification des billets électroniques pour les Jeux Olympiques 2024.

---

## 📦 Objectif du projet

Construire une plateforme de billetterie scalable, sécurisée et observable pour gérer :

- L’inscription et la connexion des utilisateurs
- L’achat de billets via Stripe
- La génération de QR codes avec clefs invisibles
- La vérification des billets le jour J
- L’administration des événements et offres
- Le suivi des métriques et logs à l’échelle

---

## 🧱 Architecture technique

| Composant      | Description                                |
|----------------|---------------------------------------------|
| `auth/`        | Authentification, JWT, clef invisible       |
| `paiement/`    | Paiement Stripe, clef achat, session        |
| `ticketing/`   | Gestion des billets, QR code, offres        |
| `verification/`| Lecture QR + vérification des clefs         |
| `gateway/`     | Reverse proxy (Traefik ou Express Gateway)  |

Chaque service est Dockerisé, isolé, et équipé de ses propres :
- `utils/` (modules utilitaires)
- `middlewares/` (auth, validation)
- `routes/` (API REST, `/health`, etc.)
- `src/index.js` (serveur Express)

---

## 🧰 Dépendances communes par service

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.3.1",
    "uuid": "^9.0.0",
    "winston": "^3.9.0",
    "redis": "^4.6.7",
    "jsonwebtoken": "^9.0.1",
    "crypto": "*",
    "zod": "^3.22.4"
  }
}

Certains services incluent aussi stripe, qrcode, axios, ou prisma selon leur rôle métier.

⚙️ Scripts internes (automation DevOps)  
Tous les scripts sont au format .cjs et se trouvent dans `scripts/`

| Script                    | Fonction                                       |
|---------------------------|------------------------------------------------|
| `generate-utils.cjs`      | Crée les fichiers clefs.js, logger.js, etc.    |
| `generate-middlewares.cjs`| Pose les middlewares auth.js et validateBody.js|
| `generate-env-example.cjs`| Génère les .env.example dans chaque service    |
| `generate-health-route.cjs`| Ajoute une route /api/health                  |
| `generate-index.cjs`      | Démarre chaque serveur Express (src/index.js)  |
| `check-health.cjs`        | Vérifie les réponses des services sur /api/health|

👉 Commande d'installation rapide :

```bash
npm run setup

"scripts": {
  "setup": "node scripts/generate-utils.cjs && node scripts/generate-middlewares.cjs && node scripts/generate-env-example.cjs && node scripts/generate-health-route.cjs && node scripts/generate-index.cjs"
}

🚀 Lancement du projet
Générer tous les fichiers :

bash
Copier
Modifier
npm run setup
Vérifier la structure :

bash
Copier
Modifier
node scripts/check-health.cjs
Lancer toute la stack :

bash
Copier
Modifier
docker compose up --build
🔐 Sécurité intégrée

JWT pour l’authentification

Clef invisible par utilisateur + clef achat

QR codé, signé avec HMAC

Middleware auth.js par route

bcrypt pour les mots de passe

Zod pour chaque payload reçu

📊 Monitoring & logs

Winston + requestId pour les logs par service

Redis pour la session, le cache, le Pub/Sub

Grafana Loki ou ELK pour centralisation des logs

Prometheus pour exporter les métriques

Jaeger (optionnel) pour le traçage distribué

📘 Structure recommandée

bash
Copier
Modifier
services/
├── auth/
│   ├── src/index.js
│   ├── utils/
│   ├── middlewares/
│   ├── routes/
│   ├── package.json
│   └── .env.example
├── paiement/
│   └── ...
scripts/
├── generate-utils.cjs
├── generate-middlewares.cjs
├── generate-env-example.cjs
├── generate-health-route.cjs
├── generate-index.cjs
├── check-health.cjs
📦 Modules utilitaires
Chaque service contient son propre :

clefs.js → génération + combinaison de clefs

jwt.js → création et vérification des tokens

logger.js → Winston + service name

redisClient.js → client Redis isolé

requestId.js → UUID par requête

✨ Ready for Prod

Scalable

Sécurisé

Monitorable

Tracable

Testable (jest, supertest, seed)

Tu peux maintenant créer les vrais endpoints métier (/register, /acheter, /scan, etc.), brancher Stripe, générer les QR codés, et valider le parcours complet.

🎯 Et si tu veux, je peux générer aussi :

Le Dockerfile type par service

Un docker-compose.yml avec tous les ports

Un README.md principal open-source

Des endpoints REST pour chaque use case métier