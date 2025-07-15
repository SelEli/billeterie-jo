const updatePaiement = async (req, res) => {
  try {
    // TODO: logique métier pour update paiement
    res.status(200).json({ message: 'update paiement OK' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur update paiement' });
  }
};

module.exports = { updatePaiement };