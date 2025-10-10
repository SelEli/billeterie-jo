// frontend/src/common/components/GenericForm.jsx
import { useState, useEffect } from 'react';
import Input from './Input';
import Button from './Button';

// helper pour datetime-local
function formatDatetimeLocal(value) {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d)) return '';
  const pad = (n) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// helper pour normaliser toutes les valeurs initiales
function normalizeInitialValues(fields, initialValues) {
  const normalized = { ...initialValues };
  fields.forEach((field) => {
    const val = normalized[field.name];
    switch (field.type) {
      case 'number':
        normalized[field.name] = val !== undefined && val !== null ? String(val) : '';
        break;
      case 'datetime-local':
        normalized[field.name] = formatDatetimeLocal(val);
        break;
      case 'checkbox':
        normalized[field.name] = Boolean(val);
        break;
      default:
        normalized[field.name] = val ?? '';
    }
  });
  return normalized;
}

export default function GenericForm({
  fields,
  initialValues = {},
  onSubmit,
  submitLabel = 'Valider',
  readOnly = false
}) {
  const [values, setValues] = useState(() => normalizeInitialValues(fields, initialValues));
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Resynchronisation si fields ou initialValues changent
  useEffect(() => {
    setValues(normalizeInitialValues(fields, initialValues));
  }, [fields, initialValues]);

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    setErrors(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (readOnly) return;

    // 🔹 Convertit number / datetime-local / checkbox pour backend
    const cleanedValues = {};
    fields.forEach((field) => {
      let val = values[field.name];
      switch (field.type) {
        case 'number':
          cleanedValues[field.name] = val === '' ? null : Number(val);
          break;
        case 'datetime-local':
          cleanedValues[field.name] = val === '' ? null : new Date(val).toISOString();
          break;
        case 'checkbox':
          cleanedValues[field.name] = Boolean(val);
          break;
        default:
          cleanedValues[field.name] = val;
      }
    });

    setLoading(true);
    setErrors(null);
    try {
      await onSubmit(cleanedValues);
    } catch (err) {
      setErrors({ global: err?.message || 'Erreur inattendue' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 card-jo" noValidate>
      {errors?.global && <div className="alert alert--error">{errors.global}</div>}

      {fields.filter(f => !f.internal).map(field => {
        const isFieldReadOnly = readOnly || field.readOnly;
        let value = values[field.name];
        if (field.type === 'checkbox') value = Boolean(value);
        return (
          <div key={field.name} className="form-group">
            {field.label && <label>{field.label}</label>}

            {isFieldReadOnly ? (
              <p className="form-readonly">
                {value !== undefined && value !== '' ? String(value) : '—'}
              </p>
            ) : (
              <Input
                type={field.type}
                label={null}
                placeholder={field.placeholder}
                options={field.options}
                value={value}
                onChange={(val) => handleChange(field.name, val)}
                disabled={loading}
              />
            )}
          </div>
        );
      })}

      {!readOnly && (
        <Button type="submit" disabled={loading} className="btn--block">
          {loading ? 'Veuillez patienter…' : submitLabel}
        </Button>
      )}
    </form>
  );
}
