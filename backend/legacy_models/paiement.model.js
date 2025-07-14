const db = require('../db');

async function ajouterPaiement({ id_utilisateur, montant, methode, date = new Date() }) {
  const result = await db.query(
    `INSERT INTO paiements (id_utilisateur, montant, methode, date)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [id_utilisateur, parseInt(montant), methode, new Date(date)]
  );
  return result.rows[0];
}

async function getTousLesPaiements() {
  const result = await db.query('SELECT * FROM paiements');
  return result.rows;
}

async function getPaiementParId(id) {
  const result = await db.query('SELECT * FROM paiements WHERE id = $1', [parseInt(id)]);
  return result.rows[0];
}

async function resetPaiements() {
  await db.query('DELETE FROM paiements');
}

module.exports = {
  ajouterPaiement,
  getTousLesPaiements,
  getPaiementParId,
  resetPaiements
};
