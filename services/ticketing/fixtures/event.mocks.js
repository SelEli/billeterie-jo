module.exports = {
  validEvent: {
    id: 999,
    label: 'Natation Hommes',
    date: new Date().toISOString(),
    location: 'Stade Aquatique',
    category: 'SPORT',
    deletedAt: null
  },
  futureEvent: {
    id: 1000,
    label: 'Judo Femmes',
    date: new Date(Date.now() + 86400000).toISOString(),
    location: 'Dojo Central',
    category: 'ARTS MARTIAUX',
    deletedAt: null
  },
  deletedEvent: {
    id: 1001,
    label: 'Match annulé',
    date: new Date().toISOString(),
    location: 'Stade Municipal',
    category: 'FOOTBALL',
    deletedAt: new Date().toISOString()
  }
};
