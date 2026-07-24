type Props = {
  /** Estado do menu — false = hambúrguer, true = X. */
  open: boolean;
  /** Tamanho do ícone em px. */
  size?: number;
  className?: string;
};

/**
 * Ícone hambúrguer ↔ X animado (baseado na animação “Menu V2”).
 *
 * Três traços no mesmo estilo dos ícones lucide do header. Ao abrir, o traço
 * do meio some enquanto os de cima e de baixo deslizam até o centro e giram
 * ±45°, formando o X. Ao fechar, o caminho se desfaz de volta ao hambúrguer.
 *
 * A rotação usa `transform-box: view-box`, o que fixa a origem no centro do
 * viewBox (12,12) — assim os dois braços cruzam exatamente no meio.
 */
export default function MenuToggle({ open, size = 24, className = '' }: Props) {
  const stroke =
    'transition-[transform,opacity] duration-[450ms] ease-[cubic-bezier(0.65,0,0.35,1)]';
  const pivot = {
    transformBox: 'view-box' as const,
    transformOrigin: 'center',
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden
      className={className}
    >
      {/* topo → braço “\” do X */}
      <line
        x1="3"
        y1="6"
        x2="21"
        y2="6"
        className={stroke}
        style={{
          ...pivot,
          transform: open ? 'rotate(45deg) translateY(6px)' : 'none',
        }}
      />
      {/* meio → desaparece */}
      <line
        x1="3"
        y1="12"
        x2="21"
        y2="12"
        className={stroke}
        style={{
          ...pivot,
          opacity: open ? 0 : 1,
          transform: open ? 'scaleX(0)' : 'none',
        }}
      />
      {/* base → braço “/” do X */}
      <line
        x1="3"
        y1="18"
        x2="21"
        y2="18"
        className={stroke}
        style={{
          ...pivot,
          transform: open ? 'rotate(-45deg) translateY(-6px)' : 'none',
        }}
      />
    </svg>
  );
}
