const db = require('../db');

async function creerUtilisateur({ nom, prenom, email, hash, cle_invisible, role = 'utilisateur' }) {
  const emailClean = email.toLowerCase().trim();
  if (!nom || !prenom || !emailClean || !hash || !cle_invisible) {
    console.warn('[Utilisateur] Données incomplètes :', { nom, prenom, emailClean, hash, cle_invisible, role });
  }

  const result = await db.query(
    `INSERT INTO utilisateurs (nom, prenom, email, hash, cle_invisible, role)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [nom, prenom, emailClean, hash, cle_invisible, role]
  );
  return result.rows[0];
}

async function trouverParEmail(email) {
  if (!email || typeof email !== 'string') return undefined;
  const result = await db.query('SELECT * FROM utilisateurs WHERE email = $1', [email.toLowerCase()]);
  return result.rows[0];
}

async function getUtilisateurParId(id) {
  const result = await db.query('SELECT * FROM utilisateurs WHERE id = $1', [parseInt(id)]);
  return result.rows[0];
}

async function getUtilisateurParCleInvisible(cle) {
  const result = await db.query('SELECT * FROM utilisateurs WHERE cle_invisible = $1', [cle]);
  return result.rows[0];
}

async function getTousLesUtilisateurs() {
  const result = await db.query('SELECT * FROM utilisateurs');
  return result.rows;
}

async function resetUtilisateurs() {
  await db.query('DELETE FROM utilisateurs');
}

module.exports = {
  creerUtilisateur,
  trouverParEmail,
  getUtilisateurParId,
  getUtilisateurParCleInvisible,
  getTousLesUtilisateurs,
  resetUtilisateurs
};
