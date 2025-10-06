const { validateId } = require('../services/core.service');

describe('Core Service Utils', () => {
  test('validateId → retourne null si invalide', () => {
    expect(validateId('abc', 'TEST')).toBeNull();
    expect(validateId(-1, 'TEST')).toBeNull();
  });

  test('validateId → retourne un entier si valide', () => {
    expect(validateId(5, 'TEST')).toBe(5);
  });
});
