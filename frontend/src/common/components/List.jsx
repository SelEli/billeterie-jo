// src/common/components/List.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function List({
  data = [],
  columns = [],
  linkBase,
  actions = [],
  renderCell
}) {
  // On récupère hasRole depuis le contexte, mais on protège si absent
  const { hasRole } = useAuth() || {};

  // Si pas de données du tout (null/undefined) → rien
  if (!data) return null;

  return (
    <div className="overflow-x-auto">
      <table className="table-jo">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col}>{col}</th>
            ))}
            {actions.length > 0 && <th className="table-jo__actions">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map(item => {
              // On garde la logique du wrapper de ligne
              const RowWrapper = ({ children }) =>
                linkBase ? (
                  <Link to={`${linkBase}/${item.id}`}>{children}</Link>
                ) : (
                  <>{children}</>
                );

              return (
                <tr key={item.id}>
                  {columns.map(col => (
                    <td key={col}>
                      <RowWrapper>
                        {renderCell
                          ? renderCell(col, item[col], item)
                          : String(item[col] ?? '')}
                      </RowWrapper>
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="table-jo__actions">
                      {actions
                        // On garde le filtrage par rôle, mais on protège si hasRole n'existe pas
                        .filter(
                          a =>
                            !a.roles ||
                            a.roles.some(r =>
                              typeof hasRole === 'function' ? hasRole(r) : true
                            )
                        )
                        .map((action, idx) => (
                          <button
                            key={idx}
                            className={`btn btn--${
                              action.danger ? 'danger' : 'secondary'
                            } btn--sm`}
                            onClick={() => action.onClick(item.id)}
                          >
                            {action.label}
                          </button>
                        ))}
                    </td>
                  )}
                </tr>
              );
            })
          ) : (
            // Ligne unique si tableau vide
            <tr>
              <td
                colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                style={{ textAlign: 'center', padding: '1rem' }}
              >
                Aucune donnée à afficher
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
