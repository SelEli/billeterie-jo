import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AxiosRequestConfig, AxiosError, Method } from 'axios';
import { api } from './apiClient';

export interface ApiResponse<TData = unknown, TMeta = unknown> {
  status: 'success' | 'error';
  errors: string[];
  data: TData;
  meta: TMeta;
}

type RequestOptions<TBody = unknown, TParams = unknown> = {
  method?: Method;
  url: string;
  params?: TParams;
  body?: TBody;
  immediate?: boolean;
  config?: AxiosRequestConfig;
  deps?: unknown[];
};

export function useApi<TData = unknown, TMeta = unknown, TBody = unknown, TParams = unknown>(
  opts: RequestOptions<TBody, TParams>
) {
  const { method = 'GET', url, params, body, immediate = true, config, deps = [] } = opts;

  const [data, setData] = useState<TData | null>(null);
  const [meta, setMeta] = useState<TMeta | null>(null);
  const [errors, setErrors] = useState<string[] | null>(null);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [status, setStatus] = useState<number | null>(null);

  const isMounted = useRef(true);
  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const execute = useCallback(async (override?: Partial<RequestOptions<TBody, TParams>>) => {
    setLoading(true);
    setErrors(null);
    try {
      const res = await api.request<ApiResponse<TData, TMeta>>({
        method: override?.method ?? method,
        url: override?.url ?? url,
        params: override?.params ?? params,
        data: override?.body ?? body,
        ...(config ?? {}),
        ...(override?.config ?? {})
      });

      if (!isMounted.current) return;
      setStatus(res.status);
      setData(res.data.data);
      setMeta(res.data.meta);
      setErrors(res.data.errors?.length ? res.data.errors : null);
      return res.data;
    } catch (err) {
      if (!isMounted.current) return;
      const axErr = err as AxiosError<unknown>;
      setStatus(axErr.response?.status ?? null);
      const backendErrors = axErr.response?.data?.errors;
      setErrors(backendErrors?.length ? backendErrors : [axErr.message]);
      setData(null);
      setMeta(null);
      throw err;
    } finally {
      if (isMounted.current) setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, url, JSON.stringify(params), JSON.stringify(body), JSON.stringify(config)]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps); // contrôlé par l'appelant

  return useMemo(() => ({
    data, meta, errors, loading, status, execute, reset: () => {
      setData(null); setMeta(null); setErrors(null); setStatus(null);
    }
  }), [data, meta, errors, loading, status, execute]);
}
