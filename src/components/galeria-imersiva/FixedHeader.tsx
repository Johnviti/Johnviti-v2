import { galleryConfig } from './galleryConfig';

/**
 * Interface mínima fixa sobre a galeria: marca, MENU e EXIT.
 * Sem fundo sólido, sem sombras — apenas tipografia pequena sobre o branco.
 */
export default function FixedHeader() {
  return (
    <header className="pointer-events-none fixed inset-0 z-40 select-none text-ink">
      {/* Marca — canto superior esquerdo */}
      <div className="absolute left-6 top-6 text-[12px] font-medium tracking-[0.22em] md:left-8 md:top-7">
        {galleryConfig.brandText}
      </div>

      {/* MENU — canto superior direito */}
      <button
        type="button"
        className="pointer-events-auto absolute right-6 top-6 flex items-center gap-2.5 text-[10px] tracking-[0.28em] text-ink/60 transition-colors duration-300 hover:text-ink md:right-8 md:top-7"
        aria-label="Abrir menu"
      >
        <span
          aria-hidden
          className="block h-2.5 w-2.5 rounded-full border border-ink/50"
        />
        {galleryConfig.menuText}
      </button>

      {/* EXIT — canto inferior esquerdo */}
      <a
        href="/"
        className="pointer-events-auto absolute bottom-6 left-6 text-[10px] tracking-[0.28em] text-ink/50 transition-colors duration-300 hover:text-ink md:bottom-7 md:left-8"
      >
        {galleryConfig.exitText}
      </a>
    </header>
  );
}
