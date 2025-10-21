// src/auth/components/ProfileForm.jsx
import GenericForm from '../../common/components/GenericForm';
import { registerFields } from '../forms/authFormConfig';

export default function ProfileForm({ initialValues, onSubmit }) {
  const fields = registerFields.filter(f => f.name !== 'password');
  return (
    <GenericForm
      fields={fields}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitLabel="Mettre à jour"
    />
  );
}
