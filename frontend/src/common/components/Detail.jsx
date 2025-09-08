// src/common/components/Detail.jsx
import { useEffect, useState } from 'react';
import PageLayout from './PageLayout';
import Loader from './Loader';

export default function Detail({
  id,
  title,
  fetchFn,             // () => Promise(data)
  FormComponent,
  onSubmit,
  onDelete,
  submitLabel = 'Enregistrer',
  redirectAfterSave,
  redirectAfterDelete,
  formProps = {},
  actions,             // fonction (data) => JSX ou JSX direct
  children             // fonction (data) => JSX ou JSX direct
}) {
  const [entity, setEntity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchFn(id)
      .then(res => mounted && setEntity(res?.data || res))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [id, fetchFn]);

  if (loading) {
    return (
      <PageLayout title={title}>
        <Loader />
      </PageLayout>
    );
  }

  const handleDelete = async () => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    await onDelete?.(id);
    if (redirectAfterDelete) redirectAfterDelete();
  };

  const handleSubmit = async (values) => {
    await onSubmit?.(values);
    setIsEdit(false);
    if (redirectAfterSave) redirectAfterSave();
  };

  const renderMaybeFn = (nodeOrFn) =>
    typeof nodeOrFn === 'function' ? nodeOrFn(entity, { isEdit, setIsEdit, handleDelete }) : nodeOrFn;

  const defaultActions = (
    <div className="actions-bar">
      {!isEdit && onSubmit && (
        <button className="btn btn--secondary" onClick={() => setIsEdit(true)}>
          Modifier
        </button>
      )}
      {onDelete && !isEdit && (
        <button className="btn btn--danger" onClick={handleDelete}>
          Supprimer
        </button>
      )}
    </div>
  );

  return (
    <PageLayout
      title={title}
      containerSize="lg"
      gap="4"
      actions={actions ? renderMaybeFn(actions) : defaultActions}
    >
      {FormComponent && (
        <FormComponent
          initialValues={{ ...entity }}
          onSubmit={handleSubmit}
          submitLabel={submitLabel}
          isEdit={isEdit}
          {...formProps}
        />
      )}
      {children && (
        <div style={{ marginTop: '1rem' }}>
          {renderMaybeFn(children)}
        </div>
      )}
    </PageLayout>
  );
}
