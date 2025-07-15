const createOffre = async (req, res) => {
  try {
    // TODO: logique métier pour create offre
    res.status(200).json({ message: 'create offre OK' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur create offre' });
  }
};

module.exports = { createOffre };