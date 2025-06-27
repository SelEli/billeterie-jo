# 🎟️ API Billetterie JO

API Express.js pour la gestion des billets, validation d’entrée et rôles agents/admin.

## 🚀 Lancer le projet

```bash
git clone https://github.com/SelEli/billetterie-jo.git
cd billetterie-jo
npm install
cp .env.example .env
npm start
```

## ⚙️ Scripts utiles

```bash
npm test         # Lance les tests Jest
npm run reset    # Réinitialise les données mémoire (si script dispo)
```

## 🧪 Tests

La suite de tests couvre :
- Authentification (login, token, accès protégé)
- Validation de billets (billet valide, rejet, rôle)
- Simulation d’achat

---

📄 Pour la documentation complète des routes :  
→ [`docs/api-validation.md`](docs/api-validation.md)  
→ [`docs/api-auth.md`](docs/api-auth.md)  
→ [`docs/api-achat.md`](docs/api-achat.md)
→ [`docs/api-offre.md`](docs/api-offre.md)
→ [`docs/api-utilisateur.md`](docs/api-utilisateur.md)
