// Mapping des préfixes vers la même base URL
const BACKEND_URLS = {
  '/auth': import.meta.env.VITE_API_URL,
  '/user': import.meta.env.VITE_API_URL,
  '/role': import.meta.env.VITE_API_URL,
  '/ticket': import.meta.env.VITE_API_URL,
  '/payment': import.meta.env.VITE_API_URL,
  '/verification': import.meta.env.VITE_API_URL,
};

export async function apiFetch(path, options = {}) {
  const { method = 'GET', body, params, headers } = options;

  console.group(`🔍 apiFetch call`);
  console.log(`➡️ Path reçu:`, path);
  console.log(`➡️ Options reçues:`, options);

  // Choix de la base URL selon le préfixe du path
  let baseUrl =
    Object.entries(BACKEND_URLS).find(([prefix]) => path.startsWith(prefix))?.[1] ||
    import.meta.env.VITE_API_URL;

  console.log(`📌 Base URL trouvée:`, baseUrl);

  if (!baseUrl) {
    console.error(`❌ Base URL introuvable pour la route ${path}`);
    throw new Error(`Base URL introuvable pour la route ${path}`);
  }

  // Normalisation : éviter double slash
  if (baseUrl.endsWith('/') && path.startsWith('/')) {
    console.log(`✂️ Retrait du slash final de baseUrl`);
    baseUrl = baseUrl.slice(0, -1);
  }

  // Déduplication : éviter /auth/auth ou /ticket/ticket
  const firstSegmentBase = baseUrl.split('/').filter(Boolean).pop();
  const firstSegmentPath = path.split('/').filter(Boolean)[0];
  console.log(`🔎 Premier segment baseUrl:`, firstSegmentBase);
  console.log(`🔎 Premier segment path:`, firstSegmentPath);

  if (firstSegmentBase && firstSegmentBase === firstSegmentPath) {
    console.log(`✂️ Déduplication du segment '${firstSegmentPath}'`);
    const [, ...rest] = path.split('/').filter(Boolean);
    path = rest.length ? '/' + rest.join('/') : '';
  }

  // Construction de l’URL finale
  let url = baseUrl + path;
  console.log(`🛠 URL après concat:`, url);

  // Ajout des paramètres de requête
  if (params && typeof params === 'object') {
    const query = new URLSearchParams(params).toString();
    if (query) {
      url += `?${query}`;
      console.log(`➕ Ajout query params:`, query);
    }
  }

  console.log(`✅ URL finale:`, url);

  // Préparation des headers
  const finalHeaders = {
    'Content-Type': 'application/json',
    ...(headers || {}),
  };
  console.log(`📦 Headers finaux:`, finalHeaders);

  const opts = {
    method,
    headers: finalHeaders,
    credentials: 'include', // 👈 crucial pour envoyer le cookie httpOnly
  };

  // Sérialisation du body
  if (body && typeof body === 'object') {
    const serialized = JSON.stringify(
      Object.fromEntries(
        Object.entries(body).map(([k, v]) => [k, v == null ? '' : v])
      )
    );
    opts.body = serialized;
    console.log(`📤 Body envoyé (JSON):`, serialized);
  }

  console.log(`🚀 Lancement fetch vers:`, url, opts);

  // Appel API
  const res = await fetch(url, opts);

  console.log(`📥 Statut HTTP:`, res.status);
  console.log(`📥 Headers réponse:`, Object.fromEntries(res.headers.entries()));

  if (res.status === 204) {
    console.log(`ℹ️ Pas de contenu (204)`);
    console.groupEnd();
    return null;
  }

  let data;
  try {
    data = await res.json();
    console.log(`📥 Body réponse JSON:`, data);
  } catch (err) {
    console.warn(`⚠️ Impossible de parser la réponse en JSON`, err);
    data = null;
  }

  // Gestion de l’expiration de session
  if (res.status === 401) {
    console.warn(`🔒 401 Unauthorized sur ${path}`);
    console.groupEnd();

    // Cas particulier : /auth/profile → simple visiteur
    if (path.startsWith('/auth/profile')) {
      throw new Error('VISITOR'); // ton AuthContext interprète ça comme "pas connecté"
    }

    // Autres routes protégées → redirection login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Session expirée, veuillez vous reconnecter');
  }

  // Gestion des erreurs API
  if (!res.ok) {
    const message =
      data?.message ||
      (Array.isArray(data?.errors) ? data.errors.join(', ') : data?.errors) ||
      'Erreur API';
    console.error(`❌ Erreur API:`, message);
    console.groupEnd();
    throw new Error(message);
  }

  console.groupEnd();
  return data;
}
