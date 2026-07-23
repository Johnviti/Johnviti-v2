import { useCallback, useEffect, useRef, useState } from 'react';
import ContactDialog from '@/components/contact/ContactDialog';
import { caseStudies } from '@/data/cases';
import { CONTACT_EMAIL, CV_URL, SOCIALS, VERSIONS } from '@/data/site';

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * Menu em tela cheia da galeria imersiva.
 *
 * Desce como uma cortina sobre a parede de imagens e reúne o que a navegação
 * por arraste não alcança: os cases pelo nome, as outras versões do site,
 * contato e currículo. Fecha no Escape e no botão.
 */

/** Curva da cortina do menu. */
const PANEL_EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';

export default function GalleryMenu({ open, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const contactButtonRef = useRef<HTMLButtonElement>(null);
  const [contactOpen, setContactOpen] = useState(false);

  const closeContact = useCallback(() => {
    setContactOpen(false);
    contactButtonRef.current?.focus();
  }, []);

  /* Escape fecha o menu — a menos que o formulário esteja por cima. */
  useEffect(() => {
    if (!open || contactOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose, contactOpen]);

  /* Foco entra no menu ao abrir. Efeito separado do Escape: se dependesse de
     `contactOpen`, abrir o formulário puxaria o foco de volta para cá. */
  useEffect(() => {
    if (!open) return;
    // Espera a cortina descer antes de mover o foco, senão o browser
    // rola o painel ainda em translateY(-100%).
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 420);
    return () => window.clearTimeout(focusTimer);
  }, [open]);

  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
  const otherVersions = VERSIONS.filter((v) => v.path !== currentPath);

  /* Entrada escalonada dos blocos, só quando aberto. */
  const stagger = (index: number) => ({
    transitionDelay: open ? `${260 + index * 55}ms` : '0ms',
  });
  const itemClass = `transition-[opacity,transform] duration-500 ease-out ${
    open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
  }`;

  return (
    <div
      className={`fixed inset-0 z-[60] ${
        open ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      inert={!open || undefined}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu da galeria"
        className="absolute inset-0 flex flex-col overflow-y-auto bg-cream text-ink transition-transform duration-700"
        style={{
          transform: open ? 'translateY(0)' : 'translateY(-100%)',
          transitionTimingFunction: PANEL_EASE,
        }}
      >
        {/* Topo — marca e fechar */}
        <div className="flex items-center justify-between px-6 py-6 md:px-8 md:py-7">
          <span className="text-[12px] font-medium tracking-[0.22em]">
            JOHN AMORIM®
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex items-center gap-2.5 text-[10px] tracking-[0.28em] text-ink/60 transition-colors duration-300 hover:text-ink"
          >
            FECHAR
            <span aria-hidden className="text-[13px] leading-none">
              ✕
            </span>
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-center px-6 pb-14 pt-4 md:px-8">
          {/* ------------------------------------------------------- Cases */}
          <nav aria-label="Cases">
            <p
              className={`text-[10px] tracking-[0.28em] text-stone-soft ${itemClass}`}
              style={stagger(0)}
            >
              CASES
            </p>
            <ul className="mt-5">
              {caseStudies.map((study, i) => (
                <li
                  key={study.slug}
                  className={`border-t border-ink/10 ${itemClass}`}
                  style={stagger(i + 1)}
                >
                  <a
                    href={`/case/${study.slug}`}
                    className="group flex items-baseline gap-4 py-3.5 md:gap-6 md:py-4"
                  >
                    <span className="font-mono text-[11px] text-stone-soft">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[clamp(1.35rem,3.6vw,2.5rem)] font-medium leading-tight tracking-tight transition-opacity duration-300 group-hover:opacity-45">
                      {study.title}
                    </span>
                    <span className="ml-auto hidden shrink-0 text-[10px] tracking-[0.24em] text-stone-soft md:block">
                      {study.category.toUpperCase()}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* ---------------------------------- Versões, contato, currículo */}
          <div
            className={`mt-14 grid gap-10 border-t border-ink/10 pt-10 sm:grid-cols-2 lg:grid-cols-3 ${itemClass}`}
            style={stagger(caseStudies.length + 1)}
          >
            <div>
              <p className="text-[10px] tracking-[0.28em] text-stone-soft">
                VERSÕES DO SITE
              </p>
              <ul className="mt-4 space-y-2 text-[15px]">
                {otherVersions.map((version) => (
                  <li key={version.path}>
                    <a
                      href={version.path}
                      className="underline-offset-4 transition-opacity duration-300 hover:opacity-50 hover:underline"
                    >
                      {version.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.28em] text-stone-soft">
                CONTATO
              </p>
              <ul className="mt-4 space-y-2 text-[15px]">
                <li>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="underline-offset-4 transition-opacity duration-300 hover:opacity-50 hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </li>
                {SOCIALS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="underline-offset-4 transition-opacity duration-300 hover:opacity-50 hover:underline"
                    >
                      {social.label.toLowerCase()} ↗
                    </a>
                  </li>
                ))}
              </ul>
              <button
                ref={contactButtonRef}
                type="button"
                onClick={() => setContactOpen(true)}
                className="mt-5 inline-flex items-center gap-3 rounded-full bg-ink px-5 py-2.5 text-[13px] text-cream transition-opacity duration-300 hover:opacity-80"
              >
                Entrar em contato
                <span aria-hidden>→</span>
              </button>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.28em] text-stone-soft">
                CURRÍCULO
              </p>
              <a
                href={CV_URL}
                download
                className="mt-4 inline-flex items-center gap-3 rounded-full border border-ink/25 px-5 py-2.5 text-[13px] transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-cream"
              >
                Baixar PDF
                <span aria-hidden>↓</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <ContactDialog open={contactOpen} onClose={closeContact} />
    </div>
  );
}
