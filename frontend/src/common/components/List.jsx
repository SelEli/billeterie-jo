// src/common/components/List.jsx
import { Link } from 'react-router-dom';

export default function List({ data = [], columns = [], linkBase }) {
  if (!data) return null;
  if (data.length === 0) {
    return <div className="glass p-4 rounded text-center">Aucune donnée à afficher</div>;
  }

  return (
    <div className="overflow-x-auto bg-white shadow rounded">
      <table className="min-w-full">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col} className="px-4 py-2 border-b text-left capitalize text-slate-600">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(item => {
            const RowWrapper = ({ children }) =>
              linkBase ? <Link to={`${linkBase}/${item.id}`}>{children}</Link> : <>{children}</>;
            return (
              <tr key={item.id} className="hover:bg-gray-50">
                {columns.map(col => (
                  <td key={col} className="px-4 py-2 border-b">
                    <RowWrapper>{String(item[col] ?? '')}</RowWrapper>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
