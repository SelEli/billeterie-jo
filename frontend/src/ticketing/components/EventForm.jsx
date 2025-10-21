// src/ticketing/components/EventForm.jsx
import GenericForm from '../../common/components/GenericForm';
import { eventFields } from '../forms/eventFormConfig';
import { useAuth } from '../../common/context/AuthContext';

export default function EventForm({
  initialValues = {},
  onSubmit,
  submitLabel = 'Valider',
  isEdit = false,
  createdById
}) {
  const { user, hasRole } = useAuth();

  const canEdit = user && (hasRole('ADMIN') || user.id === createdById);

  return (
    <GenericForm
      fields={eventFields}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitLabel={submitLabel}
      readOnly={!canEdit || !isEdit}
    />
  );
}
