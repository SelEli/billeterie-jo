// src/auth/components/AuthForm.jsx
import GenericForm from '../../common/components/GenericForm';
import { loginFields, registerFields } from '../forms/authFormConfig';

export default function AuthForm({ mode, onSubmit }) {
  const fields = mode === 'login' ? loginFields : registerFields;
  return (
    <GenericForm
      fields={fields}
      initialValues={{}}
      onSubmit={onSubmit}
      submitLabel={mode === 'login' ? 'Se connecter' : "S'inscrire"}
    />
  );
}
