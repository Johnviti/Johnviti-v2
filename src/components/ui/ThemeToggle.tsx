import IconTooltip from '@/components/ui/IconTooltip';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  /** Tamanho do ícone em px (o botão cresce junto). */
  size?: number;
};

/**
 * Toggler claro/escuro — Magic UI AnimatedThemeToggler em modo controlado
 * pelo ThemeProvider do site (`data-theme` + View Transitions).
 */
export default function ThemeToggle({ className = '', size = 20 }: Props) {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();
  const dark = theme === 'dark';
  const actionLabel = t(dark ? 'theme.toLight' : 'theme.toDark');

  return (
    <IconTooltip label={actionLabel}>
      <AnimatedThemeToggler
        theme={theme}
        onThemeChange={setTheme}
        aria-label={actionLabel}
        aria-pressed={dark}
        className={cn(
          'inline-flex items-center justify-center text-current transition-opacity duration-300 hover:opacity-60 [&_svg]:h-[var(--tt-size)] [&_svg]:w-[var(--tt-size)]',
          className,
        )}
        style={{ ['--tt-size' as string]: `${size}px` }}
      />
    </IconTooltip>
  );
}
