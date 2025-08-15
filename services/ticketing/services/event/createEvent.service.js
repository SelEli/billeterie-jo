// services/event/createEvent.service.js
const prisma = require('../../utils/prismaClient');
const { emitEventCreated } = require('../../kafka/event.kafka');
const logger = require('../../utils/logger');
const { timer } = require('../../monitor/monitor');
const { cacheEvent } = require('../../cache/event.cache');

/**
 * Service de création d'un événement
 * @param {Object} data - Données de l'événement
 * @returns {Promise<Object>} - L'événement créé
 */
async function createEventService(data) {
  const t = timer('createEventService').start();

  try {
    // --- Validation de base ---
    const requiredFields = ['label', 'date', 'location', 'category'];
    for (const field of requiredFields) {
      if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
        const err = new Error(`${field} is required`);
        err.statusCode = 400;
        throw err;
      }
    }

    // Validation spécifique pour la date
    const parsedDate = new Date(data.date);
    if (isNaN(parsedDate)) {
      const err = new Error('date is required and must be valid');
      err.statusCode = 400;
      throw err;
    }

    // --- Création en base ---
    const event = await prisma.event.create({
      data: {
        ...data,
        date: parsedDate // garantir que c’est un Date et pas une string
      },
      include: { offers: true, tickets: true }
    });

    // --- Notifications & cache (non bloquants en cas d'erreur) ---
    try {
      await emitEventCreated({
        id: event.id,
        label: event.label,
        date: event.date,
        location: event.location,
        category: event.category || null
      });
    } catch (emitErr) {
      logger.warn(`[EVENT] emitEventCreated failed: ${emitErr.message}`);
    }

    try {
      await cacheEvent(event);
    } catch (cacheErr) {
      logger.warn(`[EVENT] cacheEvent failed: ${cacheErr.message}`);
    }

    logger.info(`[EVENT] Created: ${event.id}`);
    t.success();
    return event;

  } catch (err) {
    logger.error(`[EVENT] Failed to create: ${err.message}`);
    t.fail(err);
    throw err;
  }
}

module.exports = { createEventService };
