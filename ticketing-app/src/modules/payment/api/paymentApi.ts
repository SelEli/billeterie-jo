import { Payment } from '../types';

export const processPayment = (payment: Payment): Promise<'paid' | 'failed'> => {
  // Simule un paiement avec succès aléatoire
  const success = Math.random() > 0.2;
  return new Promise((resolve) => {
    setTimeout(() => resolve(success ? 'paid' : 'failed'), 800);
  });
};
