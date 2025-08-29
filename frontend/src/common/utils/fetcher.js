// src/common/utils/fetcher.js
export async function apiFetch(path, { method = 'GET', body, params, headers } = {}) {
  let url = import.meta.env.VITE_API_URL + path;

  if (params && typeof params === 'object') {
    const query = new URLSearchParams(params).toString();
    if (query) url += `?${query}`;
  }

  const token = localStorage.getItem('token');
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {})
    }
  };

  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);

  if (res.status === 204) return null;

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (res.status === 401) {
    localStorage.removeItem('token');
    // Redirection douce
    if (typeof window !== 'undefined') window.location.href = '/login';
    throw new Error('Session expirée, veuillez vous reconnecter');
  }

  if (!res.ok) {
    const message =
      data?.message ||
      (Array.isArray(data?.errors) ? data.errors.join(', ') : data?.errors) ||
      'Erreur API';
    throw new Error(message);
  }

  return data;
}
