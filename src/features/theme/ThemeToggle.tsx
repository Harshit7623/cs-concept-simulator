import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="rounded-lg border border-border p-2 text-muted transition hover:bg-surface-hover"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
