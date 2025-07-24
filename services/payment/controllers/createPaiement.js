const createPaiement = async (req, res) => {
  try {
    // TODO: logique métier pour create paiement
    res.status(200).json({ message: 'create paiement OK' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur create paiement' });
  }
};

module.exports = { createPaiement };