const readPaiement = async (req, res) => {
  try {
    // TODO: logique métier pour read paiement
    res.status(200).json({ message: 'read paiement OK' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur read paiement' });
  }
};

module.exports = { readPaiement };