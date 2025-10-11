// src/ticketing/constants/mocks.js

export const mockEvents = [
  {
    id: 1,
    label: 'Cérémonie ouverture JO',
    basePrice: 100,
    capacity: 50000,      // Capacité totale pour l'événement
    zones: ['A', 'B', 'C'] // Zones disponibles
  },
  {
    id: 2,
    label: 'Finale 100m',
    basePrice: 150,
    capacity: 80000,
    zones: ['A', 'B', 'C', 'D']
  }
];

export const mockOffers = [
  { id: 1, label: 'Simple', discount: 0, targetRole: 'VISITOR', active: true },
  { id: 2, label: 'Duo', discount: 0.10, targetRole: 'USER', active: true },
  { id: 3, label: 'Famille', discount: 0.20, targetRole: 'USER', active: true }
];
