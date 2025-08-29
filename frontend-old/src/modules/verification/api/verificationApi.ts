import type { VerificationResult } from '../types';

export const verifyTicket = (ticketId: string): Promise<VerificationResult> => {
  const isPaid = Math.random() > 0.3;
  const zone = isPaid ? 'Zone A' : 'Interdite';

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ticketId,
        isValid: isPaid,
        zone,
        reason: isPaid ? undefined : 'Billet non payé',
      });
    }, 500);
  });
};
