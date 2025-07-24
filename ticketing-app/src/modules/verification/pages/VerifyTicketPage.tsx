import { useState } from 'react';
import { verifyTicket } from '../api/verificationApi';

export function VerifyTicket(): JSX.Element {
  const [ticketId, setTicketId] = useState('');
  const [result, setResult] = useState<null | {
    zone: string;
    reason?: string;
    isValid: boolean;
  }>(null);

  const handleScan = async () => {
    const res = await verifyTicket(ticketId);
    setResult(res);
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Scanner un billet</h2>
      <input
        type="text"
        value={ticketId}
        onChange={(e) => setTicketId(e.target.value)}
        placeholder="ID du billet"
        className="border p-2 w-full"
      />
      <button
        onClick={handleScan}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        Scanner / Vérifier
      </button>

      {result && (
        <div className="p-4 border rounded bg-gray-50">
          {result.isValid ? (
            <p className="text-green-600">✅ Billet valide — accès {result.zone}</p>
          ) : (
            <p className="text-red-600">❌ Refusé : {result.reason}</p>
          )}
        </div>
      )}
    </div>
  );
}
