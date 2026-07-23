import { useCallback, useRef, useState } from 'react';
import { Menu } from 'lucide-react';
import GalleryMenu from './GalleryMenu';
import Logo from '@/components/Logo';

/**
 * Interface mínima fixa sobre a galeria: logo (canto superior esquerdo) e
 * MENU (canto superior direito). Sem fundo sólido, sem sombras. O MENU abre
 * o overlay em tela cheia (GalleryMenu).
 */
export default function FixedHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Devolve o foco ao botão ao fechar — senão ele volta para o <body> e as
  // setas do teclado deixam de controlar a galeria.
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  return (
    <>
      {/* mix-blend-difference: logo e ícone se adaptam ao que passa por trás
          (pretos sobre áreas claras, claros sobre capas escuras). */}
      <header className="pointer-events-none fixed inset-0 z-40 select-none text-white mix-blend-difference">
        {/* Logo — canto superior esquerdo */}
        <div className="absolute left-6 top-6 md:left-8 md:top-7">
          <Logo className="h-8 w-auto" />
        </div>

        {/* MENU — canto superior direito */}
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-expanded={menuOpen}
          aria-label="Abrir menu"
          className="pointer-events-auto absolute right-6 top-5 text-white transition-opacity duration-300 hover:opacity-60 md:right-8 md:top-6"
        >
          <Menu className="size-6" strokeWidth={1.5} aria-hidden />
        </button>
      </header>

      <GalleryMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
