const { v4: uuidv4 } = require('uuid');

let validations = [];

function ajouterValidation({ id_billet, employe_validateur = null, etat_validite = 'non scanné' }) {
  if (!id_billet || typeof id_billet !== 'number') {
    console.warn('[Validation] id_billet requis :', id_billet);
  }

  const validation = {
    id: uuidv4(),
    id_billet,
    heure_scan: new Date().toISOString(),
    employe_validateur,
    etat_validite
  };

  validations.push(validation);
  return validation;
}

function getValidationParId(id) {
  return validations.find((v) => v.id === id);
}

function getValidationsParBillet(id_billet) {
  if (!id_billet || isNaN(Number(id_billet))) {
    console.warn('[Validation] id_billet invalide :', id_billet);
    return [];
  }
  return validations.filter((v) => v.id_billet === Number(id_billet));
}

function getToutesLesValidations() {
  return validations;
}

function supprimerValidation(id) {
  const index = validations.findIndex((v) => v.id === id);
  if (index !== -1) {
    validations.splice(index, 1);
    return true;
  }
  return false;
}

function resetValidations() {
  validations = [];
}

module.exports = {
  ajouterValidation,
  getValidationParId,
  getValidationsParBillet,
  getToutesLesValidations,
  supprimerValidation,
  resetValidations
};
