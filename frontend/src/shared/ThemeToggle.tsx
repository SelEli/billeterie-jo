import { useEffect, useState } from 'react';

export function ThemeToggle(): JSX.Element {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="text-sm underline text-gray-600 dark:text-gray-300"
    >
      Mode {dark ? 'Clair' : 'Sombre'}
    </button>
  );
}
