# Rapport global de tests et de couverture

## 1. Résultats par module

### Auth
- ~68% statements  
- ~55% branches  
- ~70% fonctions  
- ~65% lignes  
**Commentaire :** Très bonne couverture unitaire (~80%), intégration plus faible.

### User
- ~63% statements  
- ~55% branches  
- ~60% fonctions  
- ~66% lignes  
**Commentaire :** Controllers bien testés, services corrects, utils faibles.

### Role
- ~72% statements  
- ~60% branches  
- ~80% fonctions  
- ~72% lignes  
**Commentaire :** Bonne couverture, surtout sur les services.

### Ticketing
- ~70% statements  
- ~55% branches  
- ~75% fonctions  
- ~68% lignes  
**Commentaire :** Cas critiques couverts (création, validation, suppression). Vérification moins testée.

### Event
- ~65% statements  
- ~50% branches  
- ~60% fonctions  
- ~65% lignes  
**Commentaire :** Services très bien couverts (>85%), controllers et intégration plus faibles.

### Offer
- ~70% statements  
- ~50% branches  
- ~70% fonctions  
- ~68% lignes  
**Commentaire :** Services excellents (>90%), controllers plus bas.

### Payment
- ~65% statements  
- ~40% branches  
- ~65% fonctions  
- ~65% lignes  
**Commentaire :** Tests d’intégration simples mais couvrant les cas critiques (start/confirm).

---

## 2. Moyenne globale

- **Statements : ~70%**  
- **Branches : ~50–55%**  
- **Fonctions : ~70%**  
- **Lignes : ~68%**

---

## 3. Analyse

### Points forts
- Tests unitaires nombreux et exhaustifs (~80%).  
- Cas critiques bien couverts : authentification, paiement, billets, rôles.  
- Services souvent >85% de couverture (Event, Offer).

### Points à améliorer
- Tests d’intégration moins exhaustifs (~60%).  
- Middlewares et utils faiblement testés (<50%).  
- Certaines branches conditionnelles non couvertes.  
- Couverture plus faible sur Kafka/Redis (dépendances externes difficiles à simuler), mais scénarios critiques validés.

---

## 4. Conclusion

La stratégie de tests repose sur un équilibre entre tests unitaires et tests d’intégration :

- Les tests unitaires assurent la robustesse interne du code.  
- Les tests d’intégration valident les parcours critiques de bout en bout.

Avec une couverture globale d’environ **70%**, le projet atteint un niveau de qualité satisfaisant pour un projet de démonstration, tout en restant évolutif.  
Les axes d’amélioration identifiés (middlewares, utils, intégration plus large) permettront d’atteindre un niveau supérieur (>80%) dans les versions futures.
