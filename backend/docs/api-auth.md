# API — Authentification

---

# POST /api/auth/login

Permet de se connecter en fournissant email et mot de passe.

## Corps de requête

```json
{
  "email": "user@example.com",
  "mot_de_passe": "password"
}
```

## Réponses

| Code | Description                              |
|------|------------------------------------------|
| 200  | Connexion réussie, retourne un token JWT |
| 401  | Email ou mot de passe incorrect          |

---

# GET /api/protected

Exemple de route protégée. JWT requis.

## En-tête

```
Authorization: Bearer <token>
```

## Réponses

| Code | Description                      |
|------|----------------------------------|
| 200  | Accès autorisé                   |
| 401  | Token manquant ou invalide       |
