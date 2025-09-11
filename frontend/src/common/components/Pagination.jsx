// src/common/components/Pagination.jsx
import { useState, useEffect } from 'react';
import Loader from './Loader';

export default function Pagination({
  fetchFn,
  render,
  initialPagination = { page: 1, limit: 10, total: 0 }
}) {
  const [pagination, setPagination] = useState(initialPagination);
  const [data, setData] = useState(null);

  const loadPage = (page) => {
    fetchFn({ page, limit: pagination.limit }).then(res => {
      const root = res?.data ?? res;

      const items =
        root?.users ||
        root?.roles ||
        root?.items ||
        (Array.isArray(root) ? root : []);

      const totalFromApi =
        root?.pagination?.total ??
        root?.meta?.pagination?.total ??
        root?.total ??
        root?.count ??
        // Fallback "force" : si on a pile la limite, on suppose qu'il y a plus
        (items.length >= pagination.limit
          ? (pagination.page + 1) * pagination.limit
          : items.length);

      setData(items);
      setPagination({
        page,
        limit: pagination.limit,
        total: totalFromApi
      });
    });
  };

  useEffect(() => {
    loadPage(pagination.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;

  return (
    <>
      {!data ? (
        <Loader />
      ) : (
        render(data)
      )}

      <div className="pagination">
        <button
          className="btn btn--secondary"
          onClick={() => loadPage(pagination.page - 1)}
          disabled={pagination.page <= 1}
        >
          Précédent
        </button>

        <span className="pagination__info">
          Page {pagination.page} / {totalPages}
        </span>

        <button
          className="btn btn--secondary"
          onClick={() => loadPage(pagination.page + 1)}
          disabled={pagination.page >= totalPages}
        >
          Suivant
        </button>
      </div>
    </>
  );
}
