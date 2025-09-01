export default function Pagination({ page, limit, total, onPageChange }) {
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <button
        className="btn-jo"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Précédent
      </button>
      <span>
        Page {page} / {totalPages}
      </span>
      <button
        className="btn-jo"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Suivant
      </button>
    </div>
  );
}
