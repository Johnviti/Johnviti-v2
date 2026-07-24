import { useCallback, useRef, useState } from 'react';
import { Menu } from 'lucide-react';
import GalleryMenu from './GalleryMenu';
import Logo from '@/components/Logo';
import { ContactLink } from '@/components/loader/ContactTransition';
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

  return (
    <>
      {/* mix-blend-difference: logo e ícones se adaptam ao que passa por trás
          (pretos sobre áreas claras, claros sobre capas escuras). */}
      <header className="pointer-events-none fixed inset-0 z-40 select-none text-white mix-blend-difference">
        {/* Logo — canto superior esquerdo */}
        <div className="absolute left-6 top-6 md:left-8 md:top-7">
          <Logo className="h-8 w-auto" />
        </div>

        {/* Tema · MENU — canto superior direito */}
        <div className="pointer-events-auto absolute right-6 top-5 flex items-center gap-4 md:right-8 md:top-6">
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-label={t('nav.openMenu')}
            className="text-white transition-opacity duration-300 hover:opacity-60"
          >
            <Menu className="size-6" strokeWidth={1.5} aria-hidden />
          </button>
        </div>
      </header>

      <ContactLink
        className="fixed bottom-4 left-4 z-40 inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-[11px] font-medium text-cream shadow-lg transition-opacity hover:opacity-90 md:bottom-6 md:left-6"
      >
        <span className="size-1.5 rounded-full bg-[#28ca41]" aria-hidden />
        {t('case.floating')}
      </ContactLink>

      <GalleryMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
