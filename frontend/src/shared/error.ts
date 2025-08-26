import { AxiosError } from 'axios';

export type ApiError = {
  status?: number;
  code?: string | number;
  message: string;
  details?: unknown;
  raw?: unknown;
};

export function toApiError(err: unknown): ApiError {
  const fallback: ApiError = { message: 'Une erreur est survenue', raw: err };

  if (!err || typeof err !== 'object') return fallback;

  const ax = err as AxiosError<unknown>;
  if (ax.isAxiosError) {
    const status = ax.response?.status;
    const data = ax.response?.data;
    const message =
      data?.message ||
      data?.error ||
      ax.message ||
      `Erreur réseau${status ? ` (${status})` : ''}`;

    const details = data?.errors || data?.details || data;
    const code = (data?.code as string | number | undefined) ?? status;

    return { status, code, message, details, raw: err };
  }

  const jsErr = err as Error;
  return { message: jsErr.message || fallback.message, raw: err };
}
