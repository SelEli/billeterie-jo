import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [dark]);

  return (
    <button className="btn btn-ghost" onClick={() => setDark(d => !d)}>
      {dark ? 'Mode clair' : 'Mode sombre'}
    </button>
  );
}
