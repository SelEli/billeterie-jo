// frontend/src/ticketing/api/event.js
import { apiFetch } from '../../common/utils/fetcher';

export const listEvents = (params) =>
  apiFetch('/event', { params });

export const getEvent = (id, options = {}) => {
  if (id == null) {
    throw new Error('INVALID_EVENT_ID');
  }
  return apiFetch(`/event/${id}`, options);
};

export const createEvent = (data) =>
  apiFetch('/event', { method: 'POST', body: data });

export const updateEvent = (id, data) => {
  if (id == null) {
    throw new Error('INVALID_EVENT_ID');
  }
  return apiFetch(`/event/${id}`, { method: 'PUT', body: data });
};

export const deleteEvent = (id) => {
  if (id == null) {
    throw new Error('INVALID_EVENT_ID');
  }
  return apiFetch(`/event/${id}`, { method: 'DELETE' });
};
