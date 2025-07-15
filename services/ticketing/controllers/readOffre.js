const readOffre = async (req, res) => {
  try {
    // TODO: logique métier pour read offre
    res.status(200).json({ message: 'read offre OK' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur read offre' });
  }
};

module.exports = { readOffre };