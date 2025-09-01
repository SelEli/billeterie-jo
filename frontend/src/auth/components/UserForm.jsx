// src/auth/components/UserForm.jsx
import GenericForm from '../../common/components/GenericForm';
import { userFields } from '../forms/userFormConfig';

export default function UserForm({
  initialValues = {},
  onSubmit,
  submitLabel = 'Valider',
  isEdit = false // 🔹 nouvelle prop
}) {
  // 🔹 Si édition, on retire le champ password
  const fieldsToUse = isEdit
    ? userFields.filter(f => f.name !== 'password')
    : userFields;

  return (
    <GenericForm
      fields={fieldsToUse}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitLabel={submitLabel}
    />
  );
}
