import { useCallback, useEffect, useRef, useState } from 'react';
import ContactDialog from '@/components/contact/ContactDialog';
import { CONTACT_EMAIL, CV_URL, PROJECTS, SOCIALS, VERSIONS } from '@/data/site';

type Preview = { x: number; y: number; image: string };

const MinimalPage = () => {
  const [preview, setPreview] = useState<Preview | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const contactButtonRef = useRef<HTMLButtonElement>(null);
  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';

  const closeContact = useCallback(() => {
    setContactOpen(false);
    contactButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    document.title = 'John Amorim';
  }, []);

  return (
    <div
      className="min-h-svh bg-cream text-ink"
      onMouseMove={(e) =>
        setPreview((p) => (p ? { ...p, x: e.clientX, y: e.clientY } : p))
      }
    >
      <div className="mx-auto max-w-xl px-5 py-20 text-[15px] leading-relaxed md:py-28">
        <header>
          <h1 className="font-medium">john amorim</h1>
          <p className="text-stone-soft">desenvolvedor — maceió, brasil</p>
        </header>

        <p className="mt-10 max-w-md text-stone-soft">
          Crio produtos digitais de ponta a ponta: design, código e dados, com
          um toque de encanto.
        </p>

        <section className="mt-14">
          <h2 className="text-xs uppercase tracking-wide text-stone-soft">Projetos</h2>
          <ul className="mt-3 divide-y divide-ink/10">
            {PROJECTS.map((project) => (
              <li key={project.title}>
                <a
                  href={project.href}
                  className="group flex items-baseline justify-between gap-4 py-3"
                  onMouseEnter={(e) =>
                    setPreview({ x: e.clientX, y: e.clientY, image: project.image })
                  }
                  onMouseLeave={() => setPreview(null)}
                >
                  <span className="underline-offset-4 group-hover:underline">
                    {project.title}
                  </span>
                  <span className="shrink-0 text-xs text-stone-soft">
                    {project.category}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="text-xs uppercase tracking-wide text-stone-soft">Contato</h2>
          <ul className="mt-3 space-y-1">
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="underline-offset-4 hover:underline"
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
                  className="underline-offset-4 hover:underline"
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
            className="mt-5 inline-flex items-center gap-2.5 rounded-full bg-ink px-4 py-2 text-sm text-cream transition-opacity hover:opacity-80"
          >
            entrar em contato
            <span aria-hidden>→</span>
          </button>
        </section>

        <section className="mt-14">
          <h2 className="text-xs uppercase tracking-wide text-stone-soft">
            Currículo
          </h2>
          <a
            href={CV_URL}
            download
            className="mt-3 inline-flex items-center gap-2.5 rounded-full border border-ink/20 px-4 py-2 text-sm transition-colors hover:border-ink hover:bg-ink hover:text-cream"
          >
            baixar currículo (pdf)
            <span aria-hidden>↓</span>
          </a>
        </section>

        <footer className="mt-20 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-soft">
          <span>© {new Date().getFullYear()}</span>
          <span aria-hidden="true">·</span>
          {VERSIONS.map((version) =>
            version.path === currentPath ? (
              <span key={version.path} className="text-ink">
                {version.label}
              </span>
            ) : (
              <a
                key={version.path}
                href={version.path}
                className="underline-offset-4 hover:text-ink hover:underline"
              >
                {version.label}
              </a>
            ),
          )}
        </footer>
      </div>

      {preview && (
        <img
          src={preview.image}
          alt=""
          className="pointer-events-none fixed z-50 hidden w-64 -translate-y-1/2 rounded-md shadow-xl md:block"
          style={{ left: preview.x + 24, top: preview.y }}
        />
      )}

      <ContactDialog open={contactOpen} onClose={closeContact} />
    </div>
  );
};

export default MinimalPage;
