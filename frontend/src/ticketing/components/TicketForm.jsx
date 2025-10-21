// src/ticketing/components/TicketForm.jsx
import GenericForm from '../../common/components/GenericForm';
import { ticketFields } from '../forms/ticketFormConfig';
import { useAuth } from '../../common/context/AuthContext';

export default function TicketForm({
  initialValues = {},
  onSubmit,
  submitLabel = 'Valider',
  isEdit = false,
  createdById // id du créateur du ticket
}) {
  const { user, hasRole } = useAuth();

  // Peut éditer si admin ou créateur
  const canEdit = user && (hasRole('ADMIN') || user.id === createdById);

  // On garde tous les champs pour values, mais GenericForm filtrera les internal
  const fieldsToUse = ticketFields;

  return (
    <GenericForm
      fields={fieldsToUse}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitLabel={submitLabel}
      readOnly={!canEdit || !isEdit}
    />
  );
}
