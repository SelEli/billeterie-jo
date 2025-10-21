// src/common/utils/constants.js

export const TICKET_STATUS = {
  VALID:     { label: 'Validé', icon: '✅', color: 'green' },
  RESERVED:  { label: 'En attente de paiement', icon: '⚠️', color: 'orange' },
  USED:      { label: 'Utilisé', icon: '🎟️', color: 'gray' },
  CANCELLED: { label: 'Annulé', icon: '❌', color: 'red' },
  EXPIRED:   { label: 'Expiré', icon: '⌛', color: 'gray' }
};

export const EVENT_STATUS = {
  DRAFT:     { label: 'Brouillon', icon: '📝', color: '#6b7280' },
  PUBLISHED: { label: 'Publié', icon: '📢', color: '#16a34a' },
  SOLD_OUT:  { label: 'Complet', icon: '⛔', color: '#dc2626' },
  CANCELLED: { label: 'Annulé', icon: '❌', color: '#9ca3af' }
};

export const OFFER_STATUS = {
  ACTIVE:   { label: 'Active', icon: '💸', color: 'green' },
  INACTIVE: { label: 'Inactive', icon: '⛔', color: 'gray' }
};
