import { useParams, useNavigate, Link } from 'react-router-dom';
import Detail from '../../common/components/Detail';
import TicketForm from '../components/TicketForm';
import { getTicket, deleteTicket } from '../api/ticket';
import { useAuth } from '../../common/context/AuthContext';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  const handleDelete = async () => {
    if (!window.confirm('Supprimer ce ticket ?')) return;
    await deleteTicket(id);
    navigate('/tickets');
  };

  const actions = (
    <div className="actions-bar">
      {hasRole('ADMIN') && (
        <Link to={`/tickets/${id}/edit`} className="btn btn--secondary">
          Modifier
        </Link>
      )}
      {hasRole('ADMIN') && (
        <button className="btn btn--danger" onClick={handleDelete}>
          Supprimer
        </button>
      )}
    </div>
  );

  return (
    <Detail
      id={id}
      title={`Ticket #${id}`}
      fetchFn={getTicket}
      FormComponent={TicketForm}
      isEdit={false}
      actions={actions}
    />
  );
}
