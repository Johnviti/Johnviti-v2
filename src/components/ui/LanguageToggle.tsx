import { LANGUAGES, useI18n } from '@/lib/i18n';

type Props = {
  className?: string;
  /** `bare` usa só a cor herdada (headers com mix-blend-difference). */
  variant?: 'bare' | 'pill';
};

/**
 * Seletor de idioma — PT · EN.
 *
 * Um botão por idioma (e não um toggle cego) para que o leitor saiba de
 * antemão para onde está indo. Acrescentar um terceiro idioma é só somar a
 * entrada em `LANGUAGES`; este componente acompanha.
 */
export default function LanguageToggle({ className = '', variant = 'bare' }: Props) {
  const { lang, setLang, t } = useI18n();

  const wrapper =
    variant === 'pill'
      ? 'inline-flex items-center gap-1 rounded-full border border-ink/15 p-0.5'
      : 'inline-flex items-center gap-1';

  return (
    <div className={`${wrapper} ${className}`} role="group" aria-label={t('lang.label')}>
      {LANGUAGES.map((option, index) => {
        const active = option.code === lang;
        return (
          <span key={option.code} className="contents">
            {index > 0 && variant === 'bare' && (
              <span aria-hidden className="text-[10px] opacity-30">
                /
              </span>
            )}
            <button
              type="button"
              onClick={() => setLang(option.code)}
              aria-label={`${t('lang.switchTo')} ${option.name}`}
              aria-current={active || undefined}
              className={
                variant === 'pill'
                  ? `rounded-full px-2.5 py-1 text-[11px] font-medium tracking-[0.12em] transition-colors duration-300 ${
                      active ? 'bg-ink text-cream' : 'text-stone-soft hover:text-ink'
                    }`
                  : `text-[11px] font-medium tracking-[0.12em] transition-opacity duration-300 ${
                      active ? 'opacity-100' : 'opacity-45 hover:opacity-80'
                    }`
              }
            >
              {option.label}
            </button>
          </span>
        );
      })}
    </div>
  );
}
