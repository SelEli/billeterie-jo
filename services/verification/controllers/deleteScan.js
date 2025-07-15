const deleteScan = async (req, res) => {
  try {
    // TODO: logique métier pour delete scan
    res.status(200).json({ message: 'delete scan OK' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur delete scan' });
  }
};

module.exports = { deleteScan };