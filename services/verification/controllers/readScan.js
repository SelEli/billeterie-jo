const readScan = async (req, res) => {
  try {
    // TODO: logique métier pour read scan
    res.status(200).json({ message: 'read scan OK' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur read scan' });
  }
};

module.exports = { readScan };