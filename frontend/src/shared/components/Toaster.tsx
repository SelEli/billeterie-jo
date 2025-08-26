import { useEffect, useState } from 'react';
import { notifications, type NotifyPayload } from '../notify';

type Toast = NotifyPayload & { id: number };

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    let idCounter = 0;
    return notifications.on((payload) => {
      const id = ++idCounter;
      const toast: Toast = { id, ...payload };
      setToasts((prev) => [...prev, toast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, payload.duration ?? 3000);
    });
  }, []);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxWidth: '360px',
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>
  );
}

function ToastItem({ kind, title, message }: NotifyPayload) {
  const colors: Record<string, string> = {
    success: '#16a34a',
    error: '#dc2626',
    info: '#2563eb',
    warn: '#d97706',
  };
  const icons: Record<string, string> = {
    success: '✔️',
    error: '❌',
    info: 'ℹ️',
    warn: '⚠️',
  };
  return (
    <div
      role="alert"
      style={{
        background: colors[kind] ?? '#374151',
        color: 'white',
        padding: '12px 16px',
        borderRadius: '6px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        animation: 'fadeIn 0.25s ease-out',
      }}
    >
      <span style={{ fontSize: '1.2em' }}>{icons[kind] ?? ''}</span>
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontWeight: 'bold', marginBottom: 2 }}>{title}</div>}
        <div style={{ fontSize: '0.9em', lineHeight: 1.3 }}>{message}</div>
      </div>
    </div>
  );
}
