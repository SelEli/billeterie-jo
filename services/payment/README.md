📦 Service Payment — Paiement Billetterie JO  
Service backend Node.js / Express pour gérer les paiements de tickets, avec validation via Zod, structure contrôleur/service, et gestion d’erreurs métier.

✨ Fonctionnalités  
💳 Démarrage de paiement (`/start`)  
✅ Confirmation de paiement (`/confirm`)  
🛡️ Validation stricte des payloads avec Zod  
🧪 Tests unitaires et d’intégration (Jest + Supertest)  
📜 Logs unifiés avec Winston  
📢 Gestion des erreurs et succès métier via helpers (`sendBusinessError`, `sendBusinessSuccess`)  

🗂 Architecture  
app.js : app Express, middlewares globaux, montage des routes agrégées  
server.js : démarrage serveur, initialisations éventuelles  
routes/ : routeurs Express (payment.routes.js)  
controllers/ : logique HTTP (startPayment, confirmPayment)  
services/ : logique métier (startPaymentService, confirmPaymentService)  
schemas/ : schémas Zod stricts  
middlewares/ : middlewares réutilisables (validateRequest)  
tests/ : unitaires et intégration par domaine  
utils/ : logger, helpers d'erreur et de succès  

⚙️ Configuration  
Créer un fichier `.env` à partir de `.env.example` :

```
USE_MOCK_PAYMENT=true           # optionnel : simule un service de paiement  
PORT=3000
```

🚀 Installation & Lancement

```
npm install  
npx prisma generate        # génère le client Prisma (si DB utilisée)  
npm run dev                # mode développement  
npm start                  # mode production  
npm test                   # exécute tous les tests  
```

Healthcheck : `GET /health` → `200 OK`

📋 Endpoints API  

Paiement

| Méthode | Endpoint         | Description             | Protection |  
|--------:|------------------|-------------------------|------------|  
| POST    | /payment/start   | Démarrer un paiement    | ❌         |  
| POST    | /payment/confirm | Confirmer un paiement   | ❌         |  

📦 Schémas Zod  

- `PaymentSchema` :

```
ticketId: number (entier positif)  
amount: number (positif, optionnel)
```

🛠 Middlewares  

- `validateRequest(schema)` → valide le corps de la requête avec Zod, retourne 400 si invalide  

🧱 Contrôleurs  

Payment :  
- `startPaymentController`  
- `confirmPaymentController`  

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

- Séparation stricte : validation → contrôleur → service  
- Validation des schémas avec Zod côté middleware  
- Réponses structurées uniformes  
- Centralisation des erreurs et logs  
- Imports organisés par index.js  
- Couverture complète des cas d’erreur dans les tests  
- Logs avec préfixes homogènes (`[START PAYMENT CTRL]`, `[CONFIRM PAYMENT CTRL]`, etc.)
