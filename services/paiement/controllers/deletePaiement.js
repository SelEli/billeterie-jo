const deletePaiement = async (req, res) => {
  try {
    // TODO: logique métier pour delete paiement
    res.status(200).json({ message: 'delete paiement OK' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur delete paiement' });
  }
};

module.exports = { deletePaiement };