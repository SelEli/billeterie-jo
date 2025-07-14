const db = require('../db');

async function ajouterTypeBillet({
  nom,
  description = '',
  prix,
  accessibilite_PMR = false,
  nombre_places = 1
}) {
  const result = await db.query(
    `INSERT INTO types_billet (nom, description, prix, accessibilite_PMR, nombre_places)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [nom, description, parseInt(prix), !!accessibilite_PMR, parseInt(nombre_places)]
  );
  return result.rows[0];
}

async function getTousLesTypesBillet() {
  const result = await db.query('SELECT * FROM types_billet');
  return result.rows;
}

async function getTypeBilletParId(id) {
  const result = await db.query('SELECT * FROM types_billet WHERE id = $1', [parseInt(id)]);
  return result.rows[0];
}

async function modifierTypeBillet(id, maj) {
  const keys = Object.keys(maj);
  const values = Object.values(maj);
  const sets = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
  const result = await db.query(
    `UPDATE types_billet SET ${sets} WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, parseInt(id)]
  );
  return result.rows[0] || null;
}

async function supprimerTypeBillet(id) {
  await db.query('DELETE FROM types_billet WHERE id = $1', [parseInt(id)]);
}

async function resetTypesBillet() {
  await db.query('DELETE FROM types_billet');
}

module.exports = {
  ajouterTypeBillet,
  getTousLesTypesBillet,
  getTypeBilletParId,
  modifierTypeBillet,
  supprimerTypeBillet,
  resetTypesBillet
};
