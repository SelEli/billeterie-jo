const updateEvenement = async (req, res) => {
  try {
    // TODO: logique métier pour update evenement
    res.status(200).json({ message: 'update evenement OK' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur update evenement' });
  }
};

module.exports = { updateEvenement };