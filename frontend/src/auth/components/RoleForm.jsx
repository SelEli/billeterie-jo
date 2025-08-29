// src/auth/components/RoleForm.jsx
import GenericForm from '../../common/components/GenericForm';
import { roleFields } from '../forms/roleFormConfig';

export default function RoleForm({ initialValues, onSubmit }) {
  return (
    <GenericForm
      fields={roleFields}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitLabel="Mettre à jour le rôle"
    />
  );
}
