const deleteEvenement = async (req, res) => {
  try {
    // TODO: logique métier pour delete evenement
    res.status(200).json({ message: 'delete evenement OK' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur delete evenement' });
  }
};

module.exports = { deleteEvenement };