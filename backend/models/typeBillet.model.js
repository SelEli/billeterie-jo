let typesBillet = [];

function ajouterTypeBillet({
  nom,
  description = '',
  prix,
  accessibilite_PMR = false,
  nombre_places = 1
}) {
  const type = {
    id: Date.now(),
    nom,
    description,
    prix: parseInt(prix),
    accessibilite_PMR: !!accessibilite_PMR,
    nombre_places: parseInt(nombre_places)
  };
  typesBillet.push(type);
  return type;
}

function getTousLesTypesBillet() {
  return typesBillet;
}

function getTypeBilletParId(id) {
  return typesBillet.find((t) => t.id === parseInt(id));
}

function modifierTypeBillet(id, maj) {
  const index = typesBillet.findIndex((t) => t.id === parseInt(id));
  if (index !== -1) {
    typesBillet[index] = { ...typesBillet[index], ...maj };
    return typesBillet[index];
  }
  return null;
}

function supprimerTypeBillet(id) {
  const index = typesBillet.findIndex((t) => t.id === parseInt(id));
  if (index !== -1) typesBillet.splice(index, 1);
}

function resetTypesBillet() {
  typesBillet = [];
}

module.exports = {
  ajouterTypeBillet,
  getTousLesTypesBillet,
  getTypeBilletParId,
  modifierTypeBillet,
  supprimerTypeBillet,
  resetTypesBillet
};
