import PageLayout from './PageLayout';
import Loader from './Loader';
import { useEffect, useState } from 'react';

export default function Detail({
  id,
  title,
  fetchFn,
  FormComponent,
  onSubmit,
  onDelete,
  submitLabel = 'Enregistrer',
  redirectAfterSave,
  redirectAfterDelete,
  formProps = {}
}) {
  const [entity, setEntity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchFn(id)
      .then(res => setEntity(res?.data || res))
      .finally(() => setLoading(false));
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
    await onDelete(id);
    if (redirectAfterDelete) redirectAfterDelete();
  };

  const handleSubmit = async (values) => {
    await onSubmit(values);
    setIsEdit(false);
    if (redirectAfterSave) redirectAfterSave();
  };

  const actions = (
    <div className="actions-bar">
      {!isEdit && (
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
    <PageLayout title={title} containerSize="lg" gap="4" actions={actions}>
      <FormComponent
        initialValues={{ ...entity }}
        onSubmit={handleSubmit}
        submitLabel={submitLabel}
        isEdit={isEdit}
        {...formProps}
      />
    </PageLayout>
  );
}
