// src/auth/components/UserForm.jsx
import GenericForm from '../../common/components/GenericForm';
import { userFields } from '../forms/userFormConfig';

export default function UserForm({ initialValues = {}, onSubmit, submitLabel = 'Valider' }) {
  return (
    <GenericForm
      fields={userFields}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitLabel={submitLabel}
    />
  );
}
