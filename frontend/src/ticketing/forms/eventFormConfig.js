// src/ticketing/forms/eventFormConfig.js

export const eventFields = [
  { name: 'label', label: 'Nom de l’événement', type: 'text' },
  { name: 'category', label: 'Catégorie', type: 'text' },
  { name: 'location', label: 'Lieu', type: 'text' },
  { name: 'date', label: 'Date', type: 'datetime-local' },
  { name: 'capacity', label: 'Capacité', type: 'number' },
  { 
    name: 'status', 
    label: 'Statut', 
    type: 'select', 
    options: ['DRAFT', 'PUBLISHED', 'SOLD_OUT', 'CANCELLED'] 
  },
  { name: 'basePrice', label: 'Prix de base (€)', type: 'number' },
  { name: 'zones', label: 'Zones', type: 'tags' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'imageUrl', label: 'Image (URL)', type: 'text' },

  // Champs internes / lecture seule
  { name: 'createdAt', label: 'Créé le', type: 'text', readOnly: true },
  { name: 'updatedAt', label: 'Mis à jour le', type: 'text', readOnly: true },
  { name: 'remainingCapacity', label: 'Places restantes', type: 'text', readOnly: true }
];
