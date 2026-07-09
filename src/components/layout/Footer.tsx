import { useI18n } from '../../i18n/context';
import { site } from '../../data/site';

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="relative z-10 border-t border-line px-5 pt-24 pb-10 md:px-10 md:pt-36">
      <p className="tech-label text-muted">{t('contact.label')}</p>

      <h2 className="mt-6 max-w-4xl font-display text-[clamp(2.5rem,8vw,7rem)] leading-[0.95] font-medium tracking-tight uppercase">
        {t('contact.title')}
      </h2>

      <a
        href={`mailto:${site.email}`}
        className="tech-label mt-10 inline-block border border-line px-6 py-4 transition-colors hover:border-accent hover:text-accent"
      >
        {t('contact.cta')} — {site.email}
      </a>

      <div className="mt-24 flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
        <p className="tech-label text-muted">
          © {year} {site.name} — {t('contact.rights')}
        </p>
        <div className="flex items-center gap-6">
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="tech-label text-muted transition-colors hover:text-paper"
          >
            GitHub
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noreferrer"
            className="tech-label text-muted transition-colors hover:text-paper"
          >
            LinkedIn
          </a>
          <span className="tech-label text-muted">{site.location}</span>
        </div>
      </div>
    </footer>
  );
}
