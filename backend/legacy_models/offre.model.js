const db = require('../db');

async function ajouterOffre({ nom, description = '', nombre_personnes = 1, visible = true }) {
  const result = await db.query(
    `INSERT INTO offres (nom, description, nombre_personnes, visible)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [nom, description, parseInt(nombre_personnes), !!visible]
  );
  return result.rows[0];
}

async function getToutesLesOffres({ visiblesUniquement = false } = {}) {
  const query = visiblesUniquement
    ? 'SELECT * FROM offres WHERE visible = true'
    : 'SELECT * FROM offres';
  const result = await db.query(query);
  return result.rows;
}

async function getOffreParId(id) {
  const result = await db.query('SELECT * FROM offres WHERE id = $1', [parseInt(id)]);
  return result.rows[0];
}

async function modifierOffre(id, maj) {
  const keys = Object.keys(maj);
  const values = Object.values(maj);
  const sets = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
  const result = await db.query(
    `UPDATE offres SET ${sets} WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, parseInt(id)]
  );
  return result.rows[0] || null;
}

async function supprimerOffre(id) {
  await db.query('DELETE FROM offres WHERE id = $1', [parseInt(id)]);
}

async function resetOffres() {
  await db.query('DELETE FROM offres');
}

module.exports = {
  ajouterOffre,
  getToutesLesOffres,
  getOffreParId,
  modifierOffre,
  supprimerOffre,
  resetOffres
};
