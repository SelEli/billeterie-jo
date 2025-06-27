const {
  ajouterTypeBillet,
  viderTypesBillet
} = require('../models/typeBillet.model');

const {
  ajouterEvenement,
  viderEvenements
} = require('../models/evenement.model');

// Reset & Injection
function seedTypesBillet() {
  viderTypesBillet();

  ajouterTypeBillet({
    nom: 'Solo',
    description: 'Billet pour 1 personne',
    prix: 50,
    accessibilite_PMR: false,
    nombre_places: 1
  });

  ajouterTypeBillet({
    nom: 'Famille',
    description: '2 adultes + 2 enfants',
    prix: 160,
    accessibilite_PMR: false,
    nombre_places: 4
  });

  ajouterTypeBillet({
    nom: 'VIP',
    description: 'Accès loge + goodies',
    prix: 300,
    accessibilite_PMR: false,
    nombre_places: 1
  });

  ajouterTypeBillet({
    nom: 'PMR',
    description: 'Billet adapté à la mobilité réduite',
    prix: 40,
    accessibilite_PMR: true,
    nombre_places: 1
  });

  console.log('[SEED] Types de billets injectés');
}

function seedEvenements() {
  viderEvenements();

  ajouterEvenement({
    nom: 'Cérémonie d’ouverture',
    date: '2024-07-26T20:00:00',
    lieu: 'Stade de France',
    nombre_places_dispo: 1000
  });

  ajouterEvenement({
    nom: '100m Masculin - Finale',
    date: '2024-08-03T18:30:00',
    lieu: 'Stade Olympique',
    nombre_places_dispo: 500
  });

  ajouterEvenement({
    nom: 'Gymnastique artistique - Équipe',
    date: '2024-07-30T14:00:00',
    lieu: 'Accor Arena',
    nombre_places_dispo: 300
  });

  console.log('[SEED] Événements injectés');
}

// Lancer
seedTypesBillet();
seedEvenements();
