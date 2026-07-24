import { useCallback, useRef, useState } from 'react';
import GalleryMenu from './GalleryMenu';
import Logo from '@/components/Logo';
import { ContactLink } from '@/components/loader/ContactTransition';
import IconTooltip from '@/components/ui/IconTooltip';
import MenuToggle from '@/components/ui/MenuToggle';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useI18n } from '@/lib/i18n';

/**
 * Interface mínima fixa sobre a galeria: logo (canto superior esquerdo) e, à
 * direita, tema · MENU. Sem fundo sólido, sem sombras. O MENU abre o
 * popup de navegação (GalleryMenu). Idioma (PT/EN) fica só na página de case.
 */
export default function FixedHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { t } = useI18n();

  // Devolve o foco ao botão ao fechar — senão ele volta para o <body> e as
  // setas do teclado deixam de controlar a galeria.
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);

  return (
    <>
      {/* mix-blend-difference: logo e ícones se adaptam ao que passa por trás
          (pretos sobre áreas claras, claros sobre capas escuras). */}
      <header className="pointer-events-none fixed inset-0 z-40 select-none text-white mix-blend-difference">
        {/* Logo — canto superior esquerdo */}
        <div className="absolute left-6 top-6 md:left-10 md:top-7">
          <Logo className="h-8 w-auto" />
        </div>
      </header>

      {/* Tema · MENU — canto superior direito. Fica acima do painel (z-[70])
          para o toggle continuar visível como X e fechar o menu ao clicar. */}
      <div className="pointer-events-auto fixed right-6 top-5 z-[70] flex items-center gap-4 text-white mix-blend-difference md:right-10 md:top-6">
        {/* Tema some enquanto o menu está aberto — evita flutuar sobre o painel. */}
        <div
          className={`transition-opacity duration-300 ${
            menuOpen ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        >
          <ThemeToggle />
        </div>
        <IconTooltip label={t(menuOpen ? 'nav.closeMenu' : 'nav.openMenu')}>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-label={t(menuOpen ? 'nav.closeMenu' : 'nav.openMenu')}
            className="group relative flex size-11 items-center justify-center rounded-full text-white"
          >
            {/* Fundo circular — surge no estado X, como o antigo botão de fechar. */}
            <span
              aria-hidden
              className={`absolute inset-0 rounded-full transition-[background-color,opacity] duration-300 ${
                menuOpen
                  ? 'bg-white/[0.08] opacity-100 group-hover:bg-white/[0.14]'
                  : 'bg-transparent opacity-0'
              }`}
            />
            <MenuToggle
              open={menuOpen}
              className="relative size-6 transition-opacity duration-300 group-hover:opacity-60"
            />
          </button>
        </IconTooltip>
      </div>

      <IconTooltip
        label={t('case.ctaAction')}
        side="top"
        className="fixed bottom-4 left-4 z-40 max-w-[calc(100vw-5.5rem)] md:bottom-6 md:left-6 md:max-w-none"
      >
        <ContactLink className="inline-flex max-w-full items-center gap-1.5 truncate rounded-full bg-ink px-3.5 py-2 text-[11px] font-medium text-cream shadow-lg transition-opacity hover:opacity-90">
          <span className="size-1.5 shrink-0 rounded-full bg-[#28ca41]" aria-hidden />
          <span className="truncate">{t('case.floating')}</span>
        </ContactLink>
      </IconTooltip>

      <GalleryMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
