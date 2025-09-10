import { useParams, useNavigate, Link } from 'react-router-dom';
import Detail from '../../common/components/Detail';
import TicketForm from '../components/TicketForm';
import { getTicket, deleteTicket } from '../api/ticket';
import { useAuth } from '../../common/context/AuthContext';
import TicketStatusBadge from '../components/TicketStatusBadge';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth() || {};
  const safeHasRole = typeof hasRole === 'function' ? hasRole : () => false;

  const handleDelete = async () => {
    if (!window.confirm('Supprimer ce ticket ?')) return;
    await deleteTicket(id);
    navigate('/ticket');
  };

  return (
    <Detail
      id={id}
      title={`Ticket #${id}`}
      fetchFn={(id) => getTicket(id).then(res => res.data || res)}
      FormComponent={TicketForm}
      onDelete={(id) => deleteTicket(id)}
      redirectAfterDelete={() => navigate('/ticket')}
      // On centre le titre grâce à la classe ajoutée dans base.scss
      formProps={{ readOnly: true }}
      actions={(ticket) => {
        const isOwner = ticket?.userId === user?.id;
        const canAdmin = safeHasRole('ADMIN');
        return (
          <>
            {(canAdmin || isOwner) && (
              <Link to={`/ticket/${id}/edit`} className="btn btn--secondary">
                Modifier
              </Link>
            )}
            {(canAdmin || isOwner) && (
              <button className="btn btn--danger" onClick={handleDelete}>
                Supprimer
              </button>
            )}
          </>
        );
      }}
    >
      {(ticket) => {
        const status = (ticket?.status || '').toUpperCase();
        const isReserved = status === 'RESERVED';

        return (
          <>
            {/* Bloc statut */}
            <div className="status-block">
              <TicketStatusBadge status={ticket.status} />
              <span>{ticket.statusLabel || ''}</span>
            </div>

            {/* Bloc paiement */}
            {isReserved && (
              <div className="alert-payment">
                <span>
                  ⚠️ Ce ticket est réservé et <strong>le paiement n’a pas encore été effectué</strong>.
                </span>
                <button
                  className="btn btn--payment"
                  onClick={() => navigate(`/pay/start?ticketId=${ticket.id}`)}
                >
                  Procéder au paiement
                </button>
              </div>
            )}
          </>
        );
      }}
    </Detail>
  );
}
