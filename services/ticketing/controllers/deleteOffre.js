const deleteOffre = async (req, res) => {
  try {
    // TODO: logique métier pour delete offre
    res.status(200).json({ message: 'delete offre OK' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur delete offre' });
  }
};

module.exports = { deleteOffre };