export const loginFields = [
  { name: 'email', label: 'Email', type: 'email', placeholder: 'john@doe.com' },
  { name: 'password', label: 'Mot de passe', type: 'password', placeholder: '••••••••' }
];

export const registerFields = [
  ...loginFields,
  { name: 'firstName', label: 'Prénom', type: 'text' },
  { name: 'lastName', label: 'Nom', type: 'text' },
  { name: 'birthDate', label: 'Date de naissance', type: 'date' }
];
