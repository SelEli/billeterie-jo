export const eventFields = [
  { name: 'label', label: 'Nom de l’événement', type: 'text' },
  { name: 'category', label: 'Catégorie', type: 'text' },
  { name: 'location', label: 'Lieu', type: 'text' },
  { name: 'date', label: 'Date', type: 'datetime-local' },
  { name: 'capacity', label: 'Capacité', type: 'number' },

  // Prix de base
  { name: 'basePrice', label: 'Prix de base (€)', type: 'number' },

  // Zones → accepte string ou array, renvoie toujours un tableau
  { 
    name: 'zones', 
    label: 'Zones disponibles', 
    type: 'text', 
    placeholder: 'Ex: A,B,C,D',
    transform: (val) => {
      if (Array.isArray(val)) {
        return val.map(z => String(z).trim()).filter(Boolean);
      }
      if (typeof val === 'string') {
        return val
          .split(',')
          .map(z => z.trim())
          .filter(Boolean);
      }
      return [];
    },
    normalize: (val) => {
      // affichage dans l’input : si array → "A,B,C"
      if (Array.isArray(val)) return val.join(',');
      return val ?? '';
    }
  },

  // Statut → "" devient undefined
  { 
    name: 'status', 
    label: 'Statut', 
    type: 'select', 
    options: ['DRAFT', 'PUBLISHED', 'SOLD_OUT', 'CANCELLED'],
    transform: (val) => val === '' ? undefined : val
  },

  { name: 'description', label: 'Description', type: 'textarea' },

  // Image → "" devient undefined
  { 
    name: 'imageUrl', 
    label: 'Image (URL)', 
    type: 'text',
    transform: (val) => val === '' ? undefined : val
  },

  // Champs internes / lecture seule → marqués internal
  { name: 'createdAt', label: 'Créé le', type: 'text', readOnly: true, internal: true },
  { name: 'updatedAt', label: 'Mis à jour le', type: 'text', readOnly: true, internal: true },
  { name: 'remainingCapacity', label: 'Places restantes', type: 'text', readOnly: true, internal: true }
];
