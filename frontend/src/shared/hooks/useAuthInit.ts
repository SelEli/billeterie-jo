import { useEffect } from 'react';
import { useAuthStore } from '../../modules/auth/store/useAuthStore';

export function useAuthInit() {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchMe().catch(() => {});
    }
  }, [isAuthenticated, fetchMe]);
}
