// src/common/components/Button.jsx
export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}) {
  const classes = `btn btn--${variant} ${className}`.trim();

  return (
    <button {...props} className={classes}>
      {children}
    </button>
  );
}
