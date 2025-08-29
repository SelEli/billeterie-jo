// src/common/components/GenericForm.jsx
import { useState } from 'react';
import Input from './Input';
import Button from './Button';

export default function GenericForm({ fields, initialValues = {}, onSubmit, submitLabel = 'Valider' }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    setErrors(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);
    try {
      await onSubmit(values);
    } catch (err) {
      const msg = err?.message || 'Erreur inattendue';
      setErrors({ global: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 card-jo">
      {errors?.global && (
        <div className="text-red-700 bg-red-50 border border-red-200 p-3 rounded">{errors.global}</div>
      )}
      {fields.map(field => (
        <Input
          key={field.name}
          type={field.type}
          label={field.label}
          placeholder={field.placeholder}
          options={field.options}
          value={values[field.name] ?? ''}
          onChange={(val) => handleChange(field.name, val)}
        />
      ))}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Veuillez patienter…' : submitLabel}
      </Button>
    </form>
  );
}
