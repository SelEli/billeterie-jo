// src/common/components/GenericForm.jsx
import { useState } from 'react';
import Input from './Input';
import Button from './Button';

export default function GenericForm({
  fields,
  initialValues = {},
  onSubmit,
  submitLabel = 'Valider',
  readOnly = false // 🔹 nouveau paramètre
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    setErrors(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (readOnly) return; // 🔹 pas de submit en lecture seule
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
        <div className="alert alert--error">{errors.global}</div>
      )}

      {fields
        // 🔹 On ne rend pas les champs internes
        .filter(field => !field.internal)
        .map(field => {
          const isFieldReadOnly = readOnly || field.readOnly;
          return (
            <div key={field.name} className="form-group">
              {field.label && <label>{field.label}</label>}
              {isFieldReadOnly ? (
                <p className="form-readonly">
                  {values[field.name] !== undefined && values[field.name] !== ''
                    ? String(values[field.name])
                    : '—'}
                </p>
              ) : (
                <Input
                  type={field.type}
                  label={null} // label déjà affiché au-dessus
                  placeholder={field.placeholder}
                  options={field.options}
                  value={values[field.name] ?? ''}
                  onChange={(val) => handleChange(field.name, val)}
                  disabled={loading}
                />
              )}
            </div>
          );
        })}

      {!readOnly && (
        <Button
          type="submit"
          disabled={loading}
          className="btn--block"
        >
          {loading ? 'Veuillez patienter…' : submitLabel}
        </Button>
      )}
    </form>
  );
}
