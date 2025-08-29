export function Loader({ label = 'Chargement...' }: { label?: string }) {
  return <div aria-busy="true" aria-live="polite">{label}</div>;
}
