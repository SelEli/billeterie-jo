let paiements = [];

function ajouterPaiement({ id_utilisateur, montant, methode, date = new Date() }) {
  const paiement = {
    id: Date.now(),
    id_utilisateur,
    montant: parseInt(montant),
    methode,
    date: new Date(date)
  };
  paiements.push(paiement);
  return paiement;
}

function getTousLesPaiements() {
  return paiements;
}

function getPaiementParId(id) {
  return paiements.find((p) => p.id === parseInt(id));
}

function resetPaiements() {
  paiements = [];
}

module.exports = {
  ajouterPaiement,
  getTousLesPaiements,
  getPaiementParId,
  resetPaiements
};
