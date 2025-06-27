# API — Achat de billet

Permet la simulation d’un achat de billet simple.

---

# POST /api/achat

Ajoute un billet dans la base mémoire pour un utilisateur donné.

## Corps de requête

```json
{
  "id_utilisateur": 1,
  "id_evenement": 101,
  "id_type_billet": 3,
  "id_paiement": 999,
  "prix": 50,
  "cle_achat": "auto-généré ou fourni"
}
```

## Réponses

| Code | Description                   |
|------|-------------------------------|
| 200  | Achat enregistré              |
| 400  | Données invalides / manquantes |

---

# GET /api/utils/export

Export CSV des achats disponibles.

## Réponses

| Code | Description                 |
|------|-----------------------------|
| 200  | CSV généré                  |
| 404  | Aucun achat à exporter      |
