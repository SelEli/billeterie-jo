const db = require('../db');

async function ajouterEvenement({ nom, date, lieu, nombre_places_dispo }) {
  const result = await db.query(
    `INSERT INTO evenements (nom, date, lieu, nombre_places_dispo)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [nom, new Date(date), lieu, parseInt(nombre_places_dispo)]
  );
  return result.rows[0];
}

async function getTousLesEvenements() {
  const result = await db.query('SELECT * FROM evenements');
  return result.rows;
}

async function getEvenementParId(id) {
  const result = await db.query('SELECT * FROM evenements WHERE id = $1', [parseInt(id)]);
  return result.rows[0];
}

async function modifierEvenement(id, maj) {
  const keys = Object.keys(maj);
  const values = Object.values(maj);
  const sets = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
  const result = await db.query(
    `UPDATE evenements SET ${sets} WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, parseInt(id)]
  );
  return result.rows[0] || null;
}

async function supprimerEvenement(id) {
  await db.query('DELETE FROM evenements WHERE id = $1', [parseInt(id)]);
}

async function resetEvenements() {
  await db.query('DELETE FROM evenements');
}

module.exports = {
  ajouterEvenement,
  getTousLesEvenements,
  getEvenementParId,
  modifierEvenement,
  supprimerEvenement,
  resetEvenements
};
