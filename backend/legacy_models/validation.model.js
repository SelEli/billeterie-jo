const { v4: uuidv4 } = require('uuid');
const db = require('../db');

async function ajouterValidation({ id_billet, employe_validateur = null, etat_validite = 'non scanné' }) {
  if (!id_billet || typeof id_billet !== 'number') {
    console.warn('[Validation] id_billet requis :', id_billet);
  }

  const result = await db.query(
    `INSERT INTO validations (id, id_billet, heure_scan, employe_validateur, etat_validite)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [uuidv4(), id_billet, new Date().toISOString(), employe_validateur, etat_validite]
  );
  return result.rows[0];
}

async function getValidationParId(id) {
  const result = await db.query('SELECT * FROM validations WHERE id = $1', [id]);
  return result.rows[0];
}

async function getValidationsParBillet(id_billet) {
  if (!id_billet || isNaN(Number(id_billet))) {
    console.warn('[Validation] id_billet invalide :', id_billet);
    return [];
  }
  const result = await db.query('SELECT * FROM validations WHERE id_billet = $1', [Number(id_billet)]);
  return result.rows;
}

async function getToutesLesValidations() {
  const result = await db.query('SELECT * FROM validations');
  return result.rows;
}

async function supprimerValidation(id) {
  const result = await db.query('DELETE FROM validations WHERE id = $1 RETURNING *', [id]);
  return result.rowCount > 0;
}

async function resetValidations() {
  await db.query('DELETE FROM validations');
}

module.exports = {
  ajouterValidation,
  getValidationParId,
  getValidationsParBillet,
  getToutesLesValidations,
  supprimerValidation,
  resetValidations
};
