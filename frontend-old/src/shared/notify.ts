type NotifyKind = 'success' | 'error' | 'info' | 'warn';

export type NotifyPayload = {
  kind: NotifyKind;
  title?: string;
  message: string;
  duration?: number; // en ms
};

const EVENT_NAME = 'app:notify';

function dispatch(payload: NotifyPayload) {
  // Événement global → ton composant Toaster peut l’écouter
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: payload }));

  // Fallback console (utile si aucun toast branché)
  const prefix = `[TOAST ${payload.kind.toUpperCase()}]`;
  if (payload.kind === 'error') {
    console.error(prefix, payload.title ?? '', payload.message);
  } else {
    console.log(prefix, payload.title ?? '', payload.message);
  }
}

export const notifications = {
  on: (handler: (p: NotifyPayload) => void) => {
    const fn = (e: Event) => handler((e as CustomEvent<NotifyPayload>).detail);
    window.addEventListener(EVENT_NAME, fn);
    return () => window.removeEventListener(EVENT_NAME, fn);
  },
  success: (message: string, title = 'Succès', duration = 3000) =>
    dispatch({ kind: 'success', title, message, duration }),
  error: (message: string, title = 'Erreur', duration = 5000) =>
    dispatch({ kind: 'error', title, message, duration }),
  info: (message: string, title = 'Info', duration = 3000) =>
    dispatch({ kind: 'info', title, message, duration }),
  warn: (message: string, title = 'Attention', duration = 4000) =>
    dispatch({ kind: 'warn', title, message, duration }),
};
