/**
 * getStats.controller.js
 * ----------------------
 * Contrôleur pour récupérer les statistiques globales :
 *   - Nombre de tickets par Event
 *   - Nombre de tickets par Offer
 *   - Nombre total de tickets
 *
 * Points clés :
 *   - Auth obligatoire (ADMIN uniquement, vérifié en amont dans la route)
 *   - Logs détaillés
 *   - Gestion d'erreurs centralisée
 */

const prisma = require('../../utils/prismaClient');
const logger = require('../../utils/logger');
const { sendBusinessError, sendBusinessSuccess } = require('../../utils');
const { SUCCESS_STATUS } = require('../../utils/httpSuccessMap');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');

async function getStatsController(req, res) {
  logger.info('[CTRL][STATS] Entrée', { user: req.user });

  try {
    // Tickets par Event
    const ticketsByEvent = await prisma.ticket.groupBy({
      by: ['eventId'],
      _count: { id: true }
    });

    // Tickets par Offer
    const ticketsByOffer = await prisma.ticket.groupBy({
      by: ['offerId'],
      _count: { id: true }
    });

    // Nombre total de tickets
    const totalTickets = await prisma.ticket.count();

    // Récupérer labels pour enrichir
    const events = await prisma.event.findMany({ select: { id: true, label: true } });
    const offers = await prisma.offer.findMany({ select: { id: true, label: true } });

    const eventStats = ticketsByEvent.map(e => ({
      event: events.find(ev => ev.id === e.eventId)?.label || 'UNKNOWN',
      ventes: e._count.id
    }));

    const offerStats = ticketsByOffer.map(o => ({
      offer: offers.find(of => of.id === o.offerId)?.label || 'UNKNOWN',
      ventes: o._count.id
    }));

    const result = {
      events: eventStats,
      offers: offerStats,
      totalTickets
    };

    if (!eventStats.length && !offerStats.length) {
      logger.warn('[CTRL][STATS] Aucune statistique trouvée');
      return sendBusinessError(res, 'NO_STATS_FOUND'); // défini dans httpErrorMap.js
    }

    logger.info('[CTRL][STATS] Stats générées', result);
    return sendBusinessSuccess(res, 'GET_STATS', result); // défini dans httpSuccessMap.js

  } catch (err) {
    logger.error('[CTRL][STATS] Erreur récupération stats', { error: err.message });
    return sendBusinessError(res, 'STATS_GENERATION_FAILED'); // défini dans httpErrorMap.js
  }
}

module.exports = { getStatsController };
