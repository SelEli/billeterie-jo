import { useMemo, useState } from 'react';

export function usePagination(initialPage = 1, initialPageSize = 10) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const offset = useMemo(() => (page - 1) * pageSize, [page, pageSize]);

  return {
    page,
    pageSize,
    offset,
    setPage,
    setPageSize,
    reset: () => {
      setPage(initialPage);
      setPageSize(initialPageSize);
    },
  };
}
