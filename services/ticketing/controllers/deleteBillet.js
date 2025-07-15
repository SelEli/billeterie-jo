const deleteBillet = async (req, res) => {
  try {
    // TODO: logique métier pour delete billet
    res.status(200).json({ message: 'delete billet OK' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur delete billet' });
  }
};

module.exports = { deleteBillet };