const createEvenement = async (req, res) => {
  try {
    // TODO: logique métier pour create evenement
    res.status(200).json({ message: 'create evenement OK' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur create evenement' });
  }
};

module.exports = { createEvenement };