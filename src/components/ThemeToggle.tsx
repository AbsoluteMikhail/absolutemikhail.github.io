import { Moon, Sun } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { setThemePreference, useThemePreference } from "@/lib/theme";

type ThemeToggleProps = {
  ssr?: boolean;
};

export const ThemeToggle = ({ ssr = import.meta.env.SSR }: ThemeToggleProps = {}) => {
  const theme = useThemePreference();
  if (ssr) return <span className="inline-flex h-10 w-10 shrink-0" aria-hidden="true" />;

  const isLight = theme === "light";
  const label = isLight ? "Включить тёмную тему" : "Включить светлую тему";

  return (
    <IconButton
      variant="quiet"
      aria-label={label}
      aria-pressed={isLight}
      title={label}
      onClick={() => setThemePreference(isLight ? "dark" : "light")}
    >
      {isLight ? <Moon size={20} aria-hidden="true" /> : <Sun size={20} aria-hidden="true" />}
    </IconButton>
  );
};
