# API – Ticket Validation

## POST /api/validation

- Validates a ticket using both a cle_invisible and a cle_achat.
- Requires a JWT token in the Authorization header.

**Expected Payload:**

```json
{
  "cle_invisible": "string",
  "cle_achat": "string"
}
```

**Possible responses:**

- 200: Ticket validated  
- 400: Ticket already scanned  
- 404: Invalid cle_invisible or ticket not found  
- 403: Unauthorized access  

---

## GET /api/validation/:id

- Returns a specific validation by ID.

**Possible responses:**

- 200: Validation object  
- 404: Validation not found  

---

## GET /api/validation

- Lists all validations.

**Optional query parameters:** `evenement`, `employe`

**Example:** `/api/validation?evenement=3&employe=5`

**Possible responses:**

- 200: Array of validations  

---

## DELETE /api/validation/:id

- Deletes a specific validation by ID.

**Possible responses:**

- 200: Validation successfully deleted  
- 404: Validation not found  

---

## GET /api/validation/export

- Exports validations in CSV format.

**Possible responses:**

- 200: CSV stream download  
- 204: No data to export