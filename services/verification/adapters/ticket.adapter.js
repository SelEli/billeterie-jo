async function verifyTicket(qrPayload, jwtToken) {
  try {
    const res = await axios.post(
      `${process.env.TICKET_API_URL}/ticket/verify`,
      qrPayload, // 🔹 on envoie **tout ce qui est nécessaire pour recalculer la signature**
      { headers: { Authorization: `Bearer ${jwtToken}` } }
    );
    return res.data; // renvoie le ticket vérifié avec status
  } catch (err) {
    throw err;
  }
}
