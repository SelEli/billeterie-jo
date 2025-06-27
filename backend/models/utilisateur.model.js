let utilisateurs = [];

function creerUtilisateur({ nom, prenom, email, hash, cle_invisible, role = 'utilisateur' }) {
  const utilisateur = {
    id: Date.now(),
    nom,
    prenom,
    email: email.toLowerCase().trim(),
    hash,
    cle_invisible,
    role
  };

  if (!nom || !prenom || !email || !hash || !cle_invisible) {
    console.warn('[Utilisateur] Données incomplètes :', utilisateur);
  }

  utilisateurs.push(utilisateur);
  return utilisateur;
}

function trouverParEmail(email) {
  if (!email || typeof email !== 'string') return undefined;
  return utilisateurs.find((u) => u.email === email.toLowerCase());
}

function getUtilisateurParId(id) {
  return utilisateurs.find((u) => u.id === parseInt(id));
}

function getUtilisateurParCleInvisible(cle) {
  return utilisateurs.find((u) => u.cle_invisible === cle);
}

function getTousLesUtilisateurs() {
  return utilisateurs;
}

function resetUtilisateurs() {
  utilisateurs = [];
}

module.exports = {
  creerUtilisateur,
  trouverParEmail,
  getUtilisateurParId,
  getUtilisateurParCleInvisible,
  getTousLesUtilisateurs,
  resetUtilisateurs
};
