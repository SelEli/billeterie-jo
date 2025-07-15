const createScan = async (req, res) => {
  try {
    // TODO: logique métier pour create scan
    res.status(200).json({ message: 'create scan OK' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur create scan' });
  }
};

module.exports = { createScan };