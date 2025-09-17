// src/ticketing/forms/ticketFormConfig.js

export const ticketFields = [
  { name: 'price', label: 'Prix (€)', type: 'number' },

  // Zone devient un select si l'event fournit des zones
  { name: 'zone', label: 'Zone', type: 'select', options: [], placeholder: 'Choisir une zone' },

  { 
    name: 'status', 
    label: 'Statut', 
    type: 'select', 
    options: ['RESERVED', 'VALID', 'USED', 'CANCELLED', 'EXPIRED'] 
  },

  { name: 'userId', label: 'ID utilisateur', type: 'number' },
  { name: 'eventId', label: 'ID événement', type: 'number' },
  { name: 'offerId', label: 'ID offre', type: 'number' },

  // Champs internes : présents dans values mais pas rendus par GenericForm
  { name: 'secretKey', internal: true },
  { name: 'signature', internal: true },

  // Métadonnées affichées en lecture seule
  { name: 'createdAt', label: 'Créé le', type: 'text', readOnly: true },
  { name: 'updatedAt', label: 'Mis à jour le', type: 'text', readOnly: true },

  // Information utile pour l'utilisateur
  { name: 'remainingCapacity', label: 'Places restantes', type: 'text', readOnly: true }
];
