const updateOffre = async (req, res) => {
  try {
    // TODO: logique métier pour update offre
    res.status(200).json({ message: 'update offre OK' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur update offre' });
  }
};

module.exports = { updateOffre };