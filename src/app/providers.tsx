import { ThemeProvider } from "../features/theme/ThemeProvider";
export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
