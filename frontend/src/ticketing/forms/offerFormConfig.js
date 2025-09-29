// src/offer/forms/offerFormConfig.js

export const offerFields = [
  { name: 'label', label: 'Nom de l’offre', type: 'text' },
  { name: 'discount', label: 'Réduction (%)', type: 'number' },
  { name: 'active', label: 'Active', type: 'checkbox' },
  { name: 'validFrom', label: 'Valide à partir de', type: 'datetime-local' },
  { name: 'validTo', label: 'Valide jusqu’à', type: 'datetime-local' },
  { name: 'quota', label: 'Quota max de tickets', type: 'number' },
  { name: 'eventId', label: 'ID Événement', type: 'number' },

  // Lecture seule
  { name: 'createdAt', label: 'Créé le', type: 'text', readOnly: true },
  { name: 'updatedAt', label: 'Mis à jour le', type: 'text', readOnly: true }
];
