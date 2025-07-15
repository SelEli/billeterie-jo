const readBillet = async (req, res) => {
  try {
    // TODO: logique métier pour read billet
    res.status(200).json({ message: 'read billet OK' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur read billet' });
  }
};

module.exports = { readBillet };