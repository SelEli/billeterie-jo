const readEvenement = async (req, res) => {
  try {
    // TODO: logique métier pour read evenement
    res.status(200).json({ message: 'read evenement OK' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur read evenement' });
  }
};

module.exports = { readEvenement };