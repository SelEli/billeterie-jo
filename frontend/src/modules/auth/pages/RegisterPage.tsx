import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export function RegisterPage() {
  const { register, loading, errors } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirst] = useState('');
  const [lastName, setLast] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(
      email,
      password,
      firstName.trim() || undefined,
      lastName.trim() || undefined
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-[var(--color-primary)]">Inscription</h1>
      {errors && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm">
          {errors.map((e, i) => (
            <div key={i}>{e}</div>
          ))}
        </div>
      )}
      <form onSubmit={submit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="input"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="input"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Prénom"
            className="input"
            value={firstName}
            onChange={e => setFirst(e.target.value)}
          />
          <input
            type="text"
            placeholder="Nom"
            className="input"
            value={lastName}
            onChange={e => setLast(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Création…' : 'Créer le compte'}
        </button>
      </form>
    </div>
  );
}
