import { api } from '../../../shared/apiClient';
import type { _Ticket } from '../types';

export const getTickets = async (): Promise<_Ticket[]> => {
  const res = await api.get('/ticketing/ticket');
  return res.data;
};

export const _getTicket = async (id: string): Promise<_Ticket> => {
  const res = await api.get(`/ticketing/ticket/${id}`);
  return res.data;
};

export const createTicket = async (data: Partial<_Ticket>) => {
  const res = await api.post('/ticketing/ticket', data);
  return res.data;
};

export const updateTicket = async (id: string, data: Partial<_Ticket>) => {
  const res = await api.put(`/ticketing/ticket/${id}`, data);
  return res.data;
};

export const deleteTicket = async (id: string) => {
  await api.delete(`/ticketing/ticket/${id}`);
};
