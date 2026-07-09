import { useI18n } from '../../i18n/context';
import { site } from '../../data/site';

// Bloco final invertido (escuro sobre site claro), estilo riseatseven.
export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="relative z-10 mt-10 rounded-t-[2.5rem] bg-ink px-5 pt-24 pb-10 text-base md:px-10 md:pt-36"
    >
      <p className="tech-label text-base/50">{t('contact.label')}</p>

      <h2 className="mt-6 max-w-5xl font-display text-[clamp(2.5rem,9vw,8rem)] leading-[0.95] font-semibold tracking-tight uppercase">
        {t('contact.title')}
      </h2>

      <a
        href={`mailto:${site.email}`}
        className="tech-label mt-12 inline-block rounded-full border border-line-inv px-8 py-4 transition-colors hover:border-accent hover:text-accent"
      >
        {t('contact.cta')} — {site.email}
      </a>

      <div className="mt-28 flex flex-col gap-4 border-t border-line-inv pt-6 md:flex-row md:items-center md:justify-between">
        <p className="tech-label text-base/50">
          © {year} {site.name} — {t('contact.rights')}
        </p>
        <div className="flex items-center gap-6">
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="tech-label text-base/50 transition-colors hover:text-base"
          >
            GitHub
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noreferrer"
            className="tech-label text-base/50 transition-colors hover:text-base"
          >
            LinkedIn
          </a>
          <span className="tech-label text-base/50">{site.location}</span>
        </div>
      </div>
    </footer>
  );
}
