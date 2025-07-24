export interface Payment {
  ticketId: string;
  amount: number;
  cardNumber: string;
  status: 'pending' | 'paid' | 'failed';
}
