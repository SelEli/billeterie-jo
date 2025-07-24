import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://gateway.monsite.fr/api', // ← adapte avec ton vrai domaine
  withCredentials: true,                     // si tu utilises des cookies/session
});

// Interceptor global — pour gérer les erreurs API
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('Erreur API :', err.response?.data || err.message);
    // Tu peux ici déclencher une notif/toast ou rediriger
    throw err;
  }
);
