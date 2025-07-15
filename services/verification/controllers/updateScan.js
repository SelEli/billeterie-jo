const updateScan = async (req, res) => {
  try {
    // TODO: logique métier pour update scan
    res.status(200).json({ message: 'update scan OK' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur update scan' });
  }
};

module.exports = { updateScan };