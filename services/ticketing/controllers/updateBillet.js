const updateBillet = async (req, res) => {
  try {
    // TODO: logique métier pour update billet
    res.status(200).json({ message: 'update billet OK' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur update billet' });
  }
};

module.exports = { updateBillet };