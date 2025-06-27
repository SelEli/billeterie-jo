let offres = [];

function ajouterOffre({ nom, description = '', nombre_personnes = 1, visible = true }) {
  const offre = {
    id: Date.now(),
    nom,
    description,
    nombre_personnes: parseInt(nombre_personnes),
    visible: !!visible
  };
  offres.push(offre);
  return offre;
}

function getToutesLesOffres({ visiblesUniquement = false } = {}) {
  return visiblesUniquement
    ? offres.filter((o) => o.visible)
    : offres;
}

function getOffreParId(id) {
  return offres.find((o) => o.id === parseInt(id));
}

function modifierOffre(id, maj) {
  const index = offres.findIndex((o) => o.id === parseInt(id));
  if (index !== -1) {
    offres[index] = { ...offres[index], ...maj };
    return offres[index];
  }
  return null;
}

function supprimerOffre(id) {
  const index = offres.findIndex((o) => o.id === parseInt(id));
  if (index !== -1) offres.splice(index, 1);
}

function resetOffres() {
  offres = [];
}

module.exports = {
  ajouterOffre,
  getToutesLesOffres,
  getOffreParId,
  modifierOffre,
  supprimerOffre,
  resetOffres
};
