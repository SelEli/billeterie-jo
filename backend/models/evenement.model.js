let evenements = [];

function ajouterEvenement({ nom, date, lieu, nombre_places_dispo }) {
  const evenement = {
    id: Date.now(),
    nom,
    date: new Date(date),
    lieu,
    nombre_places_dispo: parseInt(nombre_places_dispo)
  };
  evenements.push(evenement);
  return evenement;
}

function getTousLesEvenements() {
  return evenements;
}

function getEvenementParId(id) {
  return evenements.find((e) => e.id === parseInt(id));
}

function modifierEvenement(id, maj) {
  const index = evenements.findIndex((e) => e.id === parseInt(id));
  if (index !== -1) {
    evenements[index] = { ...evenements[index], ...maj };
    return evenements[index];
  }
  return null;
}

function supprimerEvenement(id) {
  const index = evenements.findIndex((e) => e.id === parseInt(id));
  if (index !== -1) evenements.splice(index, 1);
}

function resetEvenements() {
  evenements = [];
}

module.exports = {
  ajouterEvenement,
  getTousLesEvenements,
  getEvenementParId,
  modifierEvenement,
  supprimerEvenement,
  resetEvenements
};
