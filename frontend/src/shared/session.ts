export type AuthSession = {
  _userId: number | null;
  token: string | null;
  role: string | null;
  refreshToken?: string | null;
};

let session: AuthSession = {
  _userId: null,
  token: null,
  role: null,
  refreshToken: null,
};

let onUnauthorized: (() => void) | null = null;

export const getToken = () => session.token;
export const getRefreshToken = () => session.refreshToken ?? null;

export const setSession = (next: Partial<AuthSession>) => {
  session = { ...session, ...next };
};

export const clearSession = () => {
  session = { _userId: null, token: null, role: null, refreshToken: null };
};

export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler;
};

export const triggerUnauthorized = () => {
  if (onUnauthorized) onUnauthorized();
};
