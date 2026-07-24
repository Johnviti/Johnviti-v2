import { useId, type MouseEvent } from 'react';
import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';

type Props = {
  className?: string;
  /** Tamanho do ícone em px (o botão cresce junto). */
  size?: number;
};

/**
 * Botão sol ↔ lua — ícone minimalista.
 *
 * Mostra o destino da troca: sol no tema escuro (ir para o claro), lua no
 * claro (ir para o escuro). Um círculo + 8 raios; no “lua”, a máscara morde
 * o disco e os raios somem. A animação de tema sai do centro deste botão.
 */
export default function ThemeToggle({ className = '', size = 20 }: Props) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();
  const maskId = useId();
  const dark = theme === 'dark';
  /* Ícone = próximo tema (não o atual). */
  const showMoon = !dark;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  };

  /** Oito raios — quatro nos eixos e quatro nas diagonais. */
  const rays = [
    [12, 2.5, 12, 4.7],
    [12, 19.3, 12, 21.5],
    [2.5, 12, 4.7, 12],
    [19.3, 12, 21.5, 12],
    [5.3, 5.3, 6.85, 6.85],
    [18.7, 5.3, 17.15, 6.85],
    [5.3, 18.7, 6.85, 17.15],
    [18.7, 18.7, 17.15, 17.15],
  ] as const;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={t(dark ? 'theme.toLight' : 'theme.toDark')}
      aria-pressed={dark}
      className={`inline-flex items-center justify-center transition-opacity duration-300 hover:opacity-60 ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className="overflow-visible"
      >
        <mask id={maskId}>
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <circle
            cx={showMoon ? 17 : 26}
            cy={showMoon ? 8 : 2}
            r="9"
            fill="black"
            className="transition-[cx,cy] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
          />
        </mask>

        <circle
          cx="12"
          cy="12"
          r={showMoon ? 9 : 4.5}
          fill="currentColor"
          mask={`url(#${maskId})`}
          className="transition-[r] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
        />

        <g
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          className="origin-center transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{
            opacity: showMoon ? 0 : 1,
            transform: showMoon ? 'scale(0.5)' : 'scale(1)',
          }}
        >
          {rays.map(([x1, y1, x2, y2]) => (
            <line key={`${x1}-${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </g>
      </svg>
    </button>
  );
}
