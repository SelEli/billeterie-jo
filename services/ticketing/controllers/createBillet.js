const createBillet = async (req, res) => {
  try {
    // TODO: logique métier pour create billet
    res.status(200).json({ message: 'create billet OK' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur create billet' });
  }
};

module.exports = { createBillet };