import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

const ThemeContext = createContext<{
  isDark: boolean;
  setIsDark: Dispatch<SetStateAction<boolean>>;
} | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark'),
  );

  return <ThemeContext value={{ isDark, setIsDark }}>{children}</ThemeContext>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');

  return ctx;
}
