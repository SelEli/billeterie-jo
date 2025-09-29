// src/offer/api/offer.js
import { apiFetch } from '../../common/utils/fetcher';

export const listOffers = (params) =>
  apiFetch('/offer', { params });

export const getOffer = (id, options = {}) => {
  if (id == null) throw new Error('INVALID_OFFER_ID');
  return apiFetch(`/offer/${id}`, options);
};

export const createOffer = (data) =>
  apiFetch('/offer', { method: 'POST', body: data });

export const updateOffer = (id, data) => {
  if (id == null) throw new Error('INVALID_OFFER_ID');
  return apiFetch(`/offer/${id}`, { method: 'PUT', body: data });
};

export const deleteOffer = (id) => {
  if (id == null) throw new Error('INVALID_OFFER_ID');
  return apiFetch(`/offer/${id}`, { method: 'DELETE' });
};
