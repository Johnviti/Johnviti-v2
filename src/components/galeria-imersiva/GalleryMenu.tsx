import { useEffect, useRef } from 'react';
import { Github, Instagram, Linkedin, type LucideIcon } from 'lucide-react';
import {
  ContactLink,
  RouteTransitionLink,
} from '@/components/loader/ContactTransition';
import { useI18n } from '@/lib/i18n';
import { CV_URL, SOCIALS, VERSIONS } from '@/data/site';
import { isContactPath, isGalleryPath } from '@/lib/contactTransition';

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * Menu do site — um popup escuro e minimalista, não uma cortina.
 *
 * A lista de cases saiu: quem quer ver projeto navega pela galeria, que é a
 * própria vitrine. Aqui ficam só os destinos que o arraste não alcança —
 * galeria, contato e currículo em destaque, versões como links discretos e as
 * redes como ícones no rodapé.
 *
 * O painel é escuro em qualquer tema (é um overlay, não uma superfície da
 * página) e abre ancorado no canto superior direito, onde vive o botão MENU.
 */

const PANEL_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

/* Ícone por rede — casado pelo label definido em `data/site`. */
const SOCIAL_ICON: Record<string, LucideIcon> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Instagram: Instagram,
};

export default function GalleryMenu({ open, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  /* Escape fecha. */
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  /* O foco entra no painel depois da animação de abertura. */
  useEffect(() => {
    if (!open) return;
    const focusTimer = window.setTimeout(() => panelRef.current?.focus(), 260);
    return () => window.clearTimeout(focusTimer);
  }, [open]);

  const { t } = useI18n();
  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
  const otherVersions = VERSIONS.filter((v) => v.path !== currentPath);

  const primaryLinks: { label: string; href: string; download?: boolean }[] = [
    { label: t('nav.gallery'), href: '/' },
    { label: t('nav.contact'), href: '/contato' },
    { label: t('nav.resume'), href: CV_URL, download: true },
  ];

  /* Entrada escalonada dos itens, só quando aberto. */
  const stagger = (index: number) => ({
    transitionDelay: open ? `${120 + index * 55}ms` : '0ms',
  });
  const itemClass = `transition-[opacity,transform] duration-500 ease-out ${
    open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
  }`;

  return (
    <div
      className={`fixed inset-0 z-[60] ${
        open ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      inert={!open || undefined}
    >
      {/* Fundo — clicar fora fecha */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={onClose}
        className={`absolute inset-0 cursor-default bg-black/40 backdrop-blur-[3px] transition-opacity duration-500 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.menu')}
        tabIndex={-1}
        className="absolute right-3 top-1.5 w-[min(90vw,20rem)] origin-top-right overflow-hidden rounded-[32px] bg-[#131311] px-7 pb-8 pt-6 text-[#f4f3ec] shadow-[0_30px_80px_-24px_rgba(0,0,0,0.6)] ring-1 ring-white/[0.06] outline-none transition-[opacity,transform] duration-500 md:right-5 md:top-3"
        style={{
          transform: open ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(-10px)',
          opacity: open ? 1 : 0,
          transitionTimingFunction: PANEL_EASE,
        }}
      >
        {/* Destinos principais — o botão de fechar (X) vive no toggle do header. */}
        <nav className="pr-14 pt-4">
          <ul>
            {primaryLinks.map((link, i) => (
              <li key={link.href} className={itemClass} style={stagger(i)}>
                {isContactPath(link.href) ? (
                  <ContactLink
                    href={link.href}
                    className="block py-1 text-[2rem] font-medium leading-[1.28] tracking-tight text-[#f4f3ec] transition-colors duration-300 hover:text-white/55"
                  >
                    {link.label}
                  </ContactLink>
                ) : isGalleryPath(link.href) ? (
                  <RouteTransitionLink
                    href={link.href}
                    className="block py-1 text-[2rem] font-medium leading-[1.28] tracking-tight text-[#f4f3ec] transition-colors duration-300 hover:text-white/55"
                  >
                    {link.label}
                  </RouteTransitionLink>
                ) : (
                  <a
                    href={link.href}
                    download={link.download}
                    className="block py-1 text-[2rem] font-medium leading-[1.28] tracking-tight text-[#f4f3ec] transition-colors duration-300 hover:text-white/55"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Versões do site — links discretos (só se houver alguma) */}
        {otherVersions.length > 0 && (
          <ul className="mt-6 space-y-1.5">
            {otherVersions.map((version, i) => (
              <li
                key={version.path}
                className={itemClass}
                style={stagger(primaryLinks.length + i)}
              >
                <a
                  href={version.path}
                  className="text-[15px] text-white/35 transition-colors duration-300 hover:text-white/70"
                >
                  {version.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* Redes — ícones no rodapé */}
        <div
          className={`mt-8 flex items-center gap-5 ${itemClass}`}
          style={stagger(primaryLinks.length + otherVersions.length)}
        >
          {SOCIALS.map((social) => {
            const Icon = SOCIAL_ICON[social.label];
            if (!Icon) return null;
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="text-white/40 transition-colors duration-300 hover:text-white"
              >
                <Icon className="size-[22px]" strokeWidth={1.75} aria-hidden />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
