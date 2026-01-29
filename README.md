# Billetterie JO 2024 — Plateforme Microservices (Bac+3)

Projet réalisé en autonomie complète dans le cadre d’un Bac+3.  
Objectif : concevoir une plateforme de billetterie sécurisée pour les JO 2024, basée sur une architecture microservices (auth, paiement mock, ticketing, vérification) avec communication distribuée via Kafka et Redis, et un front React déployé sur Railway.

---

## 📚 Table des matières
- [Objectifs du projet](#-objectifs-du-projet)
- [Aperçu visuel](#-aperçu-visuel)
- [Ce que j’ai appris](#-ce-que-jai-appris)
- [Architecture technique](#-architecture-technique)
- [Stack technique](#-stack-technique)
- [Commandes Docker](#-commandes-docker)
- [Sécurité](#-sécurité)
- [Monitoring & Railway](#-monitoring--railway)
- [Structure du projet](#-structure-du-projet)
- [Liens importants](#-liens-importants)

---

## 🎯 Objectifs du projet
- Concevoir une architecture **microservices** modulaire et scalable.  
- Implémenter un système de **billets sécurisés** (JWT + double clé unique + QR signé).  
- Simuler un **paiement sécurisé** via un service mock.  
- Gérer la communication distribuée via **Kafka** et **Redis**.  
- Déployer l’ensemble sur **Railway** (services isolés).  
- Réaliser le projet seul, à distance, avec documentation complète.

---

## 🖼 Aperçu visuel
- Accueil : navigation + épreuves  
- Admin : statuts des billets, actions, table dynamique  
- Ticket valide : QR code signé  
- Architecture : schéma global du projet (`Architecture logicielle Site billeterie JO.drawio.png`)

---

## 🎓 Ce que j’ai appris
- Architecture microservices (Kafka, Redis, services isolés)  
- Authentification sécurisée (JWT + HMAC + double clé unique)  
- Paiement mock avec génération de clé d’achat  
- Validation stricte des données avec Zod  
- Monitoring distribué (Winston, Swagger)  
- Déploiement Railway (services indépendants)  
- Front React connecté aux services backend  

---

## 🏗 Architecture technique

| Service      | Rôle métier                                     |
|--------------|-------------------------------------------------|
| auth/        | Inscription, connexion, double clé invisible     |
| paiement/    | Mock paiement, clé d’achat unique, Kafka events |
| ticketing/   | Création billets, QR code signé, statuts        |
| verification/| Scan, validation, contrôles événement           |
| frontend/    | Front-end & reverse proxy                       |

Chaque service contient :
- controllers/  
- routes/  
- schemas/ (Zod)  
- utils/ (redis, kafka, logger…)  
- middlewares/  
- src/index.js  

---

## 🧰 Stack technique

| Module        | Usage                                           |
|---------------|-------------------------------------------------|
| express       | Serveur HTTP REST                               |
| redis         | Cache, session, Pub/Sub                         |
| kafkajs       | Messaging distribué                             |
| jsonwebtoken  | Auth JWT                                        |
| crypto        | HMAC, signatures                                |
| zod           | Validation stricte                              |
| prisma        | ORM SQL                                         |
| winston       | Logging structuré                               |
| uuid          | Identifiants uniques                            |

---

## 🛠 Commandes Docker

### Lancer l’infra (Kafka, Redis, Postgres)
```
docker compose -f docker-compose.infra.yml up -d
```

### Lancer un service en dev
```
docker compose -f docker-compose.<service>.yml -f docker-compose.<service>.override.yml up --build
```

### Lancer un service en prod
```
docker compose -f docker-compose.<service>.yml up -d --build
```

### Arrêter un service
```
docker compose -f docker-compose.<service>.yml down
```

---

## 🔐 Sécurité
- JWT sécurisé  
- Double clé invisible par utilisateur  
- Clé d’achat unique générée par le service paiement  
- QR code signé (HMAC)  
- Validation Zod par payload  
- bcrypt pour les mots de passe  

---

## 📊 Monitoring & Railway

### Logging
- Winston + SERVICE_NAME  
- Logs par microservice  
- Traçabilité des événements Kafka  

### Documentation API (Swagger)
Exemple d’endpoint (service ticketing) :
```
GET /api/tickets/:id
- Récupère un billet
- Vérifie la signature HMAC
- Retourne le QR code signé
```

Swagger disponible sur chaque service :
```
/api/docs
```

### Railway — Tableau de contrôle
- Déploiement séparé par service  
- Logs en temps réel  
- Variables d’environnement par microservice  
- Redémarrage automatique en cas d’erreur  
- Monitoring CPU / RAM intégré  

---

## 📁 Structure du projet
```
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
├── ticketing/
├── verification/
frontend/
└── ...
```

---

## 🔗 Liens importants
- Kanban : https://tinyurl.com/sellier-kanban-jo  
- Démo : https://frontend-production-a1c6.up.railway.app/app/
