module.exports = {
  validEvent: {
    id: 999,
    name: 'Natation Hommes',
    venue: 'Stade Aquatique',
    datetime: new Date().toISOString()
  },
  futureEvent: {
    id: 1000,
    name: 'Judo Femmes',
    venue: 'Dojo Central',
    datetime: new Date(Date.now() + 86400000).toISOString()
  }
};
