export default function Button({ children, ...props }) {
  return (
    <button {...props} className="btn-jo">
      {children}
    </button>
  );
}
