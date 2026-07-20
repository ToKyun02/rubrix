import { Button } from '@/atom-components/Button';
import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';

export default function ThemeToggleButton() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark'),
  );

  const handleClick = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };
  return (
    <Button size="icon" variant="icon" onClick={handleClick}>
      {isDark ? <Moon size="20" /> : <Sun size="20" />}
    </Button>
  );
}
