## 📘 API Documentation – Utilisateur

### `POST /api/utilisateur`

> Create a new user account

**Request Body (application/json):**
```json
{
  "email": "exemple@domaine.com",
  "nom": "Dupont",
  "motDePasse": "secret123"
}
```

**Success Response (201 Created):**
```json
{
  "message": "Utilisateur créé avec succès",
  "utilisateur": {
    "email": "exemple@domaine.com",
    "nom": "Dupont"
  }
}
```

**Errors:**
- `400 Bad Request` – Invalid input
- `500 Internal Server Error` – Creation failure

---

### `PUT /api/utilisateur/:id`

> Update an existing user

**Request Body (application/json):**
```json
{
  "email": "nouveau@mail.com",
  "nom": "NouveauNom",
  "motDePasse": "nouveaumdp123"
}
```

**Success Response (200 OK):**
```json
{
  "message": "Utilisateur 42 mis à jour",
  "utilisateur": {
    "id": "42",
    "email": "nouveau@mail.com",
    "nom": "NouveauNom"
  }
}
```
