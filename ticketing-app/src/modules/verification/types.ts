export interface VerificationResult {
  ticketId: string;
  isValid: boolean;
  zone: string;
  reason?: string;
}
