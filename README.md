# Billetterie JO 2024 — README 

## Aperçu visuel

Vue d’accueil du site de billetterie JO 2024, avec navigation, CTA, et affichage des épreuves à venir.

Vue administrateur des billets :
- Suivi des statuts : en attente, validé, utilisé
- Actions disponibles : paiement, vérification
- Table dynamique connectée aux microservices backend
- Affichage des événements, prix, QR codes et sessions Stripe

## Ce que j’ai appris

- Architecture microservices avec Kafka, Redis, Stripe
- Authentification sécurisée avec JWT et QR codé signé
- Dockerisation complète de la stack
- Validation stricte des données avec Zod
- Monitoring distribué (Winston, Swagger, Prometheus)
- Mise en ligne d’un front React connecté aux services backend
- Interface admin avec logique métier complète

## 🛠 Commandes Docker à connaître (mode pro)

### Lancer l’infrastructure de base (Kafka, Redis, Postgres, etc.)
```bash
docker compose -f docker-compose.infra.yml up -d
```

### Lancer un service en développement (avec hot reload)
```bash
docker compose -f docker-compose.<service>.yml -f docker-compose.<service>.override.yml up --build
```
Remplacer `<service>` par auth, ticketing, payment ou verification.

### Lancer un service en production (image figée, sans volume)
```bash
docker compose -f docker-compose.<service>.yml up -d --build
```

### Arrêter un service
```bash
docker compose -f docker-compose.<service>.yml down
```

## 📜 Description du projet
Architecture modulaire orientée microservices pour gérer l’authentification, la réservation, le paiement sécurisé, la traçabilité, la génération et la vérification des billets électroniques des Jeux Olympiques 2024.

## 🎯 Objectif du projet
Concevoir une plateforme billetterie :

- Scalable et modulaire
- Sécurisée avec JWT + Stripe
- Traçable avec Kafka, Redis, Winston
- Testable et observable en temps réel

## 🏗 Architecture technique

| Service      | Rôle métier                                     |
|--------------|-------------------------------------------------|
| auth/        | Inscription, connexion, clefs invisibles        |
| paiement/    | Session Stripe, clef achat, Kafka billet-achat  |
| ticketing/   | Création des billets, QR code, statuts          |
| verification/| Scan, validation de billet, contrôles événement |
| frontend/    | Front-end & Reverse proxy centralisé            |

Chaque microservice est isolé, Dockerisé, et contient :

- **controllers/** : logique métier par action
- **routes/** : endpoints REST modulaires
- **schemas/** : validation Zod par use case
- **utils/** : modules internes (logger, redis, kafka…)
- **middlewares/** : auth, validation, etc.
- **src/index.js** : démarrage Express

## 🧰 Stack technique

| Module        | Usage commun                                    |
|---------------|-------------------------------------------------|
| express       | Serveur HTTP REST                               |
| dotenv        | Variables d’environnement                       |
| winston       | Logging par service avec SERVICE_NAME           |
| redis         | Session, cache, Pub/Sub                         |
| jsonwebtoken  | Authentification JWT                            |
| crypto        | HMAC, clefs invisibles                          |
| zod           | Validation stricte des entrées                  |
| kafkajs       | Messaging distribué — billet-achat, etc.        |
| stripe        | Paiement sécurisé                               |
| prisma        | ORM SQL généré                                  |
| uuid          | Identifiants et tracking                        |

## 🚀 Installation rapide
```bash
npm install
```

### Démarrer toute la stack (prod)
```bash
docker compose up --build
```

## 🔐 Sécurité

- JWT sécurisé
- Clé invisible par utilisateur
- Clé d’achat unique + session Stripe
- QR codé signé (HMAC)
- Middleware Auth.js par route
- Validation Zod par payload
- bcrypt pour les mots de passe

## 📊 Monitoring & observabilité

- Winston + SERVICE_NAME
- Kafka (pub/consume)
- Redis (cache + session)
- Swagger UI par service (/api/docs)
- Prometheus pour métriques
- Grafana Loki ou ELK pour logs
- Jaeger (optionnel) pour traçage distribué

## 📁 Structure du projet

### Code
```plaintext
services/
├── auth/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── schemas/
│   ├── utils/
│   ├── src/index.js
│   └── .env.example
├── paiement/
│   └── ...
├── ticketing/
│   └── ...
├── verification/
│   └── ...
frontend/
└── ...
```
