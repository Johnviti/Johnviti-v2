import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navigation, profile } from '@/data/ux-portfolio';
import { Container, ButtonLink } from './primitives';
import Logo from './Logo';

/**
 * Header fixo, quase transparente no topo e com fundo desfocado depois da
 * primeira rolagem. No mobile o menu vira um painel de tela cheia, com foco
 * preso ao painel enquanto ele está aberto.
 */
export default function Header({ homeHref = '/ux' }: { homeHref?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Trava a rolagem do documento enquanto o menu mobile está aberto. */
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const links = navigation.map((item) => ({
    ...item,
    href: homeHref === '/ux' ? item.href : `${homeHref}${item.href}`,
  }));

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-[var(--color-text)] focus:px-5 focus:py-3 focus:text-[14px] focus:text-white"
      >
        Pular para o conteúdo
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[60] transition-[background-color,border-color,backdrop-filter] duration-300',
          scrolled
            ? 'border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-background)_78%,transparent)] backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <Container className="flex h-[68px] items-center justify-between gap-6">
          <a
            href={homeHref}
            className="flex items-center gap-3 rounded-full"
            aria-label={`${profile.name} — início`}
          >
            <Logo size={32} />
            <span className="hidden text-[15px] font-semibold tracking-[-0.01em] sm:block">
              {profile.name}
            </span>
          </a>

          <nav aria-label="Principal" className="hidden items-center gap-8 lg:flex">
            {links.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="ux-link text-[14px] text-[var(--color-muted)] transition-colors duration-200 hover:text-[var(--color-text)]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ButtonLink
              href={`mailto:${profile.email}`}
              size="sm"
              className="hidden sm:inline-flex"
            >
              Vamos conversar
            </ButtonLink>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="ux-menu-mobile"
              className="inline-flex size-11 items-center justify-center rounded-full text-[var(--color-text)] lg:hidden"
            >
              <span className="sr-only">{open ? 'Fechar menu' : 'Abrir menu'}</span>
              {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </Container>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="ux-menu-mobile"
            initial={{ opacity: 0, y: reduced ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -8 }}
            transition={{ duration: reduced ? 0.001 : 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[55] bg-[var(--color-background)] pt-[68px] lg:hidden"
          >
            <Container className="flex h-full flex-col justify-between py-10">
              <nav aria-label="Principal (mobile)" className="flex flex-col">
                {links.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="border-b border-[var(--color-border)] py-5 text-[28px] font-semibold tracking-[-0.03em]"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="space-y-4">
                <ButtonLink href={`mailto:${profile.email}`} size="lg" className="w-full">
                  Vamos conversar
                </ButtonLink>
                <p className="text-[13px] text-[var(--color-muted)]">{profile.location}</p>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
