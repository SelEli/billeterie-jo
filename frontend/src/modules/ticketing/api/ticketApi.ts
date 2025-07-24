import { api } from '../../../shared/apiClient';
import { Ticket } from '../types';

export const getTickets = async (): Promise<Ticket[]> => {
  const res = await api.get('/ticketing/ticket');
  return res.data;
};

export const getTicket = async (id: string): Promise<Ticket> => {
  const res = await api.get(`/ticketing/ticket/${id}`);
  return res.data;
};

export const createTicket = async (data: Partial<Ticket>) => {
  const res = await api.post('/ticketing/ticket', data);
  return res.data;
};

export const updateTicket = async (id: string, data: Partial<Ticket>) => {
  const res = await api.put(`/ticketing/ticket/${id}`, data);
  return res.data;
};

export const deleteTicket = async (id: string) => {
  await api.delete(`/ticketing/ticket/${id}`);
};
