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
  const { hasRole } = useAuth();

  if (!data) return null;
  if (data.length === 0) {
    return <div className="glass p-4 rounded text-center">Aucune donnée à afficher</div>;
  }

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
          {data.map(item => {
            const RowWrapper = ({ children }) =>
              linkBase ? <Link to={`${linkBase}/${item.id}`}>{children}</Link> : <>{children}</>;
            return (
              <tr key={item.id}>
                {columns.map(col => (
                  <td key={col}>
                    <RowWrapper>
                      {renderCell ? renderCell(col, item[col], item) : String(item[col] ?? '')}
                    </RowWrapper>
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="table-jo__actions">
                    {actions
                      .filter(a => !a.roles || a.roles.some(r => hasRole(r)))
                      .map((action, idx) => (
                        <button
                          key={idx}
                          className={`btn btn--${action.danger ? 'danger' : 'secondary'} btn--sm`}
                          onClick={() => action.onClick(item.id)}
                        >
                          {action.label}
                        </button>
                      ))}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
