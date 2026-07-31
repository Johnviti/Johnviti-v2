import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Navegação lateral do estudo de caso (desktop). A seção ativa é detectada por
 * IntersectionObserver; a lista continua sendo só de links âncora, então
 * funciona sem JavaScript e com teclado.
 *
 * Como a nav é fixa, ela atravessa as seções de fundo escuro. Cada item mede a
 * própria posição contra as superfícies marcadas com `data-ux-surface="dark"` e
 * inverte a cor ao entrar nelas — a transição acontece item a item, e não em
 * bloco, para que a nav nunca fique parcialmente ilegível.
 */
export type CaseNavItem = { id: string; label: string };

export default function CaseNav({ items }: { items: CaseNavItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const [onDark, setOnDark] = useState<string[]>([]);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    /* Só leitura de layout por evento de scroll (o browser já os limita a ~1
       por quadro) — sem rAF, que não dispara em aba sem renderização. */
    const measure = () => {
      const list = listRef.current;
      /* Com a nav escondida (`display: none`) os retângulos zeram — nada a fazer. */
      if (!list || !list.getClientRects().length) return;

      const darkAreas = Array.from(
        document.querySelectorAll<HTMLElement>('[data-ux-surface="dark"]'),
      ).map((el) => el.getBoundingClientRect());

      const next: string[] = [];
      list.querySelectorAll<HTMLAnchorElement>('a[data-section]').forEach((link) => {
        const rect = link.getBoundingClientRect();
        const middle = rect.top + rect.height / 2;
        if (darkAreas.some((area) => area.top <= middle && area.bottom >= middle)) {
          next.push(link.dataset.section as string);
        }
      });

      setOnDark((current) =>
        current.length === next.length && current.every((id, i) => id === next[i])
          ? current
          : next,
      );
    };

    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [items]);

  return (
    <nav
      aria-label="Seções do estudo de caso"
      className="pointer-events-none fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
    >
      <ul ref={listRef} className="pointer-events-auto space-y-1">
        {items.map((item) => {
          const isActive = active === item.id;
          const dark = onDark.includes(item.id);

          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                data-section={item.id}
                aria-current={isActive ? 'true' : undefined}
                className="group flex items-center gap-3 py-1"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'h-px transition-all duration-300',
                    isActive
                      ? cn('w-8', dark ? 'bg-white' : 'bg-[var(--color-text)]')
                      : cn(
                          'w-4 group-hover:w-6',
                          dark
                            ? 'bg-white/30 group-hover:bg-white/70'
                            : 'bg-[var(--color-border)] group-hover:bg-[var(--color-muted)]',
                        ),
                  )}
                />
                <span
                  className={cn(
                    'text-[11px] uppercase tracking-[0.14em] transition-colors duration-300',
                    isActive
                      ? dark
                        ? 'text-white'
                        : 'text-[var(--color-text)]'
                      : cn(
                          'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100',
                          dark ? 'text-white/70' : 'text-[var(--color-muted)]',
                        ),
                  )}
                >
                  {item.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
