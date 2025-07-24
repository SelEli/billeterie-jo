const { PrismaClient } = require('@prisma/client');
const { ticketPurchaseSchema } = require('../schemas/ticketPurchase');
const { kafka } = require('../utils/kafkaClient');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const crypto = require('crypto');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

const acheterBillet = async (req, res) => {
  try {
    const id_utilisateur = req.user?.utilisateurId;
    if (!id_utilisateur) {
      logger.warn({ message: 'Unauthorized access', path: req.path });
      return res.status(401).json({ message: 'Unauthorized user' });
    }

    const result = ticketPurchaseSchema.safeParse(req.body);
    if (!result.success) {
      logger.warn({ message: 'Validation failed', errors: result.error.errors });
      return res.status(400).json({ message: 'Invalid request body', errors: result.error.errors });
    }

    const { id_evenement, prix, id_type_billet, id_offre } = result.data;

    const evenement = await prisma.evenement.findUnique({ where: { id: id_evenement } });
    if (!evenement || evenement.nombre_places_dispo <= 0) {
      logger.warn({ message: 'Event not available or full', id_evenement });
      return res.status(400).json({ message: 'Event unavailable or fully booked' });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: `Billet pour ${evenement.nom}` },
          unit_amount: prix * 100
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel'
    });

    const cle_achat = crypto.randomBytes(16).toString('hex');

    const { paiement, billet } = await prisma.$transaction(async tx => {
      const paiement = await tx.paiement.create({
        data: {
          id_utilisateur,
          montant: prix,
          methode: 'CB',
          date: new Date(),
          stripe_session_id: stripeSession.id
        }
      });

      const billet = await tx.billet.create({
        data: {
          id_utilisateur,
          id_evenement,
          id_type_billet,
          id_offre,
          id_paiement: paiement.id,
          prix,
          cle_achat,
          statut: 'valide'
        }
      });

      await tx.evenement.update({
        where: { id: id_evenement },
        data: {
          nombre_places_dispo: {
            decrement: 1
          }
        }
      });

      return { paiement, billet };
    });

    const producer = kafka.producer();
    await producer.connect();
    await producer.send({
      topic: 'billet-achat',
      messages: [
        {
          key: id_utilisateur,
          value: JSON.stringify({
            billet_id: billet.id,
            cle_achat,
            prix,
            evenement_id: id_evenement
          })
        }
      ]
    });
    await producer.disconnect();

    logger.info({ message: 'Billet acheté', billet_id: billet.id });
    res.status(201).json({
      message: 'Ticket purchased successfully',
      billet,
      paiement,
      stripe_url: stripeSession.url
    });
  } catch (error) {
    logger.error({
      message: 'Error in acheterBillet controller',
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ message: 'Internal server error during ticket purchase' });
  }
};

module.exports = { acheterBillet };
