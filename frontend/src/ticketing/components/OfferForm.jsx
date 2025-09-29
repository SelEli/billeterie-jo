// src/offer/components/OfferForm.jsx
import GenericForm from '../../common/components/GenericForm';
import { offerFields } from '../forms/offerFormConfig';
import { useAuth } from '../../common/context/AuthContext';

export default function OfferForm({
  initialValues = {},
  onSubmit,
  submitLabel = 'Valider',
  isEdit = false
}) {
  const { user, hasRole } = useAuth();

  const canEdit = user && hasRole('ADMIN');

  return (
    <GenericForm
      fields={offerFields}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitLabel={submitLabel}
      readOnly={!canEdit || !isEdit}
    />
  );
}
