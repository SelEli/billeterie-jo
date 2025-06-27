let billets = [];

function ajouterBillet({
  id_utilisateur,
  id_evenement,
  id_type_billet,
  id_paiement,
  prix,
  cle_achat,
  cle_invisible = null
}) {
  const billet = {
    id: Date.now(),
    id_utilisateur,
    id_evenement,
    id_type_billet,
    id_paiement,
    prix: parseInt(prix),
    cle_achat,
    cle_invisible
  };

  billets.push(billet);
  return billet;
}

function getTousLesBillets() {
  return billets;
}

function getBilletParCleAchat(cle_achat) {
  return billets.find((b) => b.cle_achat === cle_achat);
}

function getBilletParCleInvisibleEtAchat(cle_invisible, cle_achat) {
  return billets.find(
    (b) => b.cle_invisible === cle_invisible && b.cle_achat === cle_achat
  );
}

function supprimerBillet(id) {
  const index = billets.findIndex((b) => b.id === parseInt(id));
  if (index !== -1) billets.splice(index, 1);
}

function resetBillets() {
  billets = [];
}

module.exports = {
  ajouterBillet,
  getTousLesBillets,
  getBilletParCleAchat,
  getBilletParCleInvisibleEtAchat,
  supprimerBillet,
  resetBillets
};
