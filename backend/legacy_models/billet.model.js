const db = require('../db');

async function ajouterBillet({
  id_utilisateur,
  id_evenement,
  id_type_billet,
  id_paiement,
  prix,
  cle_achat,
  cle_invisible = null
}) {
  const result = await db.query(
    `INSERT INTO billets (id_utilisateur, id_evenement, id_type_billet, id_paiement, prix, cle_achat, cle_invisible)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [id_utilisateur, id_evenement, id_type_billet, id_paiement, parseInt(prix), cle_achat, cle_invisible]
  );
  return result.rows[0];
}

async function getTousLesBillets() {
  const result = await db.query('SELECT * FROM billets');
  return result.rows;
}

async function getBilletParCleAchat(cle_achat) {
  const result = await db.query('SELECT * FROM billets WHERE cle_achat = $1', [cle_achat]);
  return result.rows[0];
}

async function getBilletParCleInvisibleEtAchat(cle_invisible, cle_achat) {
  const result = await db.query(
    'SELECT * FROM billets WHERE cle_invisible = $1 AND cle_achat = $2',
    [cle_invisible, cle_achat]
  );
  return result.rows[0];
}

async function supprimerBillet(id) {
  await db.query('DELETE FROM billets WHERE id = $1', [parseInt(id)]);
}

async function resetBillets() {
  await db.query('DELETE FROM billets');
}

module.exports = {
  ajouterBillet,
  getTousLesBillets,
  getBilletParCleAchat,
  getBilletParCleInvisibleEtAchat,
  supprimerBillet,
  resetBillets
};
