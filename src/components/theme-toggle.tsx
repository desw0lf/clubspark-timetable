import { useTheme } from "../providers/theme-provider";
import IconThemeLight from "../assets/icon-theme-light.svg";
import IconThemeDark from "../assets/icon-theme-dark.svg";

export const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();
  const toggleTheme = () => {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const currentTheme = theme === "system" ? systemTheme : theme;
    setTheme(currentTheme === "dark" ? "light" : "dark");
  }
  return (
    <button onClick={toggleTheme} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0" type="button">
      <IconThemeLight />
      <IconThemeDark />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}