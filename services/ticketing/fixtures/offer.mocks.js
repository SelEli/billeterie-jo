module.exports = {
  validOffer: {
    id: 101,
    label: 'Pack Jeunesse',
    discount: 0.3,
    active: true,
    targetRole: 'USER',
    eventId: 999,
    validFrom: new Date().toISOString(),
    validTo: new Date(Date.now() + 7 * 86400000).toISOString(),
    quota: 100
  },
  fullDiscountOffer: {
    id: 102,
    label: 'Staff Gratuit',
    discount: 1.0,
    active: true,
    targetRole: 'EMPLOYEE',
    eventId: null,
    validFrom: null,
    validTo: null,
    quota: null
  },
  inactiveOffer: {
    id: 103,
    label: 'Promo expirée',
    discount: 0.15,
    active: false,
    targetRole: 'USER',
    eventId: 999,
    validFrom: new Date(Date.now() - 14 * 86400000).toISOString(),
    validTo: new Date(Date.now() - 7 * 86400000).toISOString(),
    quota: 0
  }
};
