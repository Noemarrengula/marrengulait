import { Moon, Sun, Monitor, Check } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const { theme, setTheme, isDarkMode, isSystemPreference } = useSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  const themeOptions = [
    { value: 'light' as const, label: 'Claro', icon: Sun },
    { value: 'dark' as const, label: 'Escuro', icon: Moon },
    { value: 'system' as const, label: 'Sistema', icon: Monitor },
  ];

  const currentTheme = themeOptions.find(t => t.value === theme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 hover:bg-accent/10 transition-colors relative"
          title={`Tema: ${currentTheme?.label}${isSystemPreference ? ' (Sistema)' : ''}`}
        >
          {isDarkMode ? (
            <Moon className="h-5 w-5 text-foreground transition-transform hover:rotate-12" />
          ) : (
            <Sun className="h-5 w-5 text-foreground transition-transform hover:rotate-12" />
          )}
          {isSystemPreference && (
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full" />
          )}
          <span className="sr-only">Alterar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
          Tema
        </div>
        {themeOptions.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            className="cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span>{label}</span>
              {isSystemPreference && value === 'system' && (
                <span className="text-xs text-blue-500 ml-1">(Atual)</span>
              )}
            </div>
            {theme === value && <Check className="h-4 w-4 text-[#FF3131]" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
