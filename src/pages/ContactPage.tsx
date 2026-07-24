import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { motion, MotionConfig, type Variants } from 'framer-motion';
import { Menu } from 'lucide-react';
import Logo from '@/components/Logo';
import GalleryMenu from '@/components/galeria-imersiva/GalleryMenu';
import { RouteTransitionLink } from '@/components/loader/ContactTransition';
import LanguageToggle from '@/components/ui/LanguageToggle';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { CONTACT_EMAIL, CONTACT_INBOX, SOCIALS } from '@/data/site';
import { useI18n, type Lang } from '@/lib/i18n';

/**
 * Página de contato — estrutura inspirada em cuberto.com/contacts: um título
 * enorme e conversado, o pedido montado por chips (o que você precisa e quanto
 * pretende investir) e só então os campos de texto. Os blocos de e-mail,
 * localização e redes fecham a página.
 *
 * O envio usa o mesmo Web3Forms do resto do site: a chave é pública por design
 * (ela só autoriza o envio para uma caixa já fixada). Sem chave configurada, o
 * formulário não finge funcionar — avisa e oferece o e-mail direto.
 */

const ENDPOINT = 'https://api.web3forms.com/submit';
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim();

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

/** Serviços oferecidos — a etiqueta muda com o idioma, o valor enviado não. */
const SERVICES: { id: string; label: Record<Lang, string> }[] = [
  { id: 'site', label: { pt: 'Site do zero', en: 'Site from scratch' } },
  { id: 'uxui', label: { pt: 'UX/UI design', en: 'UX/UI design' } },
  { id: 'product', label: { pt: 'Product design', en: 'Product design' } },
  { id: 'landing', label: { pt: 'Landing page', en: 'Landing page' } },
  { id: 'dashboards', label: { pt: 'Dados & dashboards', en: 'Data & dashboards' } },
  { id: 'frontend', label: { pt: 'Front-end', en: 'Front-end' } },
  { id: 'branding', label: { pt: 'Branding', en: 'Branding' } },
  { id: 'motion', label: { pt: 'Motion design', en: 'Motion design' } },
];

/** Faixas de orçamento (em reais; a versão EN mostra o equivalente em dólar). */
const BUDGETS: { id: string; label: Record<Lang, string> }[] = [
  { id: '5-10', label: { pt: 'R$ 5–10 mil', en: '$1–2k' } },
  { id: '10-20', label: { pt: 'R$ 10–20 mil', en: '$2–4k' } },
  { id: '20-50', label: { pt: 'R$ 20–50 mil', en: '$4–10k' } },
  { id: '50+', label: { pt: 'R$ 50 mil +', en: '$10k +' } },
];

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'error'; message: string };

const ContactPage = () => {
  const { t, lang } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fieldId = useId();

  const [services, setServices] = useState<string[]>([]);
  const [budget, setBudget] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const configured = Boolean(ACCESS_KEY);
  const sending = status.kind === 'sending';

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    document.title =
      lang === 'pt' ? 'John Amorim - Contato' : 'John Amorim - Contact';
  }, [lang]);

  const toggleService = (id: string) =>
    setServices((current) =>
      current.includes(id) ? current.filter((s) => s !== id) : [...current, id],
    );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!ACCESS_KEY) return;

      const data = new FormData(event.currentTarget);
      // Honeypot: preenchido só por robô — descarta sem avisar o remetente.
      if (data.get('botcheck')) {
        setStatus({ kind: 'sent' });
        return;
      }

      // As escolhas em chip viajam como texto legível no corpo do e-mail.
      const chosenServices = SERVICES.filter((s) => services.includes(s.id))
        .map((s) => s.label.pt)
        .join(', ');
      const chosenBudget =
        BUDGETS.find((b) => b.id === budget)?.label.pt ?? t('contact.budgetSkip');

      setStatus({ kind: 'sending' });
      try {
        const response = await fetch(ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            access_key: ACCESS_KEY,
            subject: `Contato pelo portfólio — ${data.get('name')}`,
            from_name: 'Portfólio John Amorim',
            name: data.get('name'),
            email: data.get('email'),
            company: data.get('company') || '—',
            services: chosenServices || '—',
            budget: chosenBudget,
            message: data.get('message'),
          }),
        });
        const result = (await response.json()) as {
          success?: boolean;
          message?: string;
        };

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Falha no envio.');
        }
        setStatus({ kind: 'sent' });
        formRef.current?.reset();
        setServices([]);
        setBudget(null);
      } catch (error) {
        setStatus({
          kind: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'Não foi possível enviar a mensagem.',
        });
      }
    },
    [services, budget, t],
  );

  const fieldClass =
    'mt-2 w-full border-b border-ink/20 bg-transparent pb-3 text-[17px] outline-none transition-colors placeholder:text-stone-soft/60 focus:border-ink disabled:opacity-50 md:text-[19px]';
  const labelClass = 'text-[10px] tracking-[0.28em] text-stone-soft';

  const chipClass = (active: boolean) =>
    `rounded-full border px-4 py-2.5 text-[13px] transition-colors duration-300 md:text-[14px] ${
      active
        ? 'border-ink bg-ink text-cream'
        : 'border-ink/20 text-ink hover:border-ink/60'
    }`;

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-svh bg-surface text-ink">
        {/* ------------------------------------------------------- Header */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 text-white mix-blend-difference md:px-10"
        >
          <RouteTransitionLink
            href="/"
            aria-label="John Amorim"
            className="transition-opacity duration-300 hover:opacity-70"
          >
            <Logo className="h-6 w-auto md:h-7" />
          </RouteTransitionLink>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <ThemeToggle />
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-label={t('nav.openMenu')}
              className="transition-opacity duration-300 hover:opacity-60"
            >
              <Menu className="size-6" strokeWidth={1.5} aria-hidden />
            </button>
          </div>
        </motion.header>

        <GalleryMenu open={menuOpen} onClose={closeMenu} />

        {/* --------------------------------------------------------- Hero */}
        <section className="px-6 pt-32 md:px-10 md:pt-44">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.p variants={fadeUp} className={labelClass}>
              {t('contact.eyebrow').toUpperCase()}
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="mt-6 max-w-[16ch] text-[clamp(2.6rem,8vw,6.5rem)] font-medium leading-[0.98] tracking-[-0.03em]"
            >
              {t('contact.title')}
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-8 max-w-[46ch] text-[16px] leading-relaxed text-charcoal md:text-[18px]"
            >
              {t('contact.lead')}
            </motion.p>
          </motion.div>
        </section>

        {/* ----------------------------------------------------- Formulário */}
        <section className="px-6 pb-24 pt-16 md:px-10 md:pb-32 md:pt-24">
          {status.kind === 'sent' ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="flex flex-col items-start gap-5 rounded-[28px] bg-cream-soft px-7 py-16 md:px-14"
            >
              <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-medium tracking-tight">
                {t('contact.sentTitle')}
              </h2>
              <p className="max-w-[46ch] text-[16px] leading-relaxed text-charcoal">
                {t('contact.sentBody')}
              </p>
              <button
                type="button"
                onClick={() => setStatus({ kind: 'idle' })}
                className="mt-2 rounded-full border border-ink/25 px-6 py-3 text-[14px] transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-cream"
              >
                {t('contact.sentAgain')}
              </button>
            </motion.div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="max-w-[1100px]">
              {/* Honeypot — invisível para gente, irresistível para robô */}
              <input
                type="checkbox"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden
              />

              {/* ------------------------------------------- Serviços */}
              <fieldset>
                <legend className={labelClass}>
                  {t('contact.servicesLabel').toUpperCase()}
                </legend>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {SERVICES.map((service) => {
                    const active = services.includes(service.id);
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => toggleService(service.id)}
                        aria-pressed={active}
                        className={chipClass(active)}
                      >
                        {service.label[lang]}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* ------------------------------------------ Orçamento */}
              <fieldset className="mt-14">
                <legend className={labelClass}>
                  {t('contact.budgetLabel').toUpperCase()}
                </legend>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {BUDGETS.map((option) => {
                    const active = budget === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setBudget(active ? null : option.id)}
                        aria-pressed={active}
                        className={chipClass(active)}
                      >
                        {option.label[lang]}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setBudget(budget === 'skip' ? null : 'skip')}
                    aria-pressed={budget === 'skip'}
                    className={chipClass(budget === 'skip')}
                  >
                    {t('contact.budgetSkip')}
                  </button>
                </div>
              </fieldset>

              {/* --------------------------------------------- Campos */}
              <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-x-16">
                <div>
                  <label className={labelClass} htmlFor={`${fieldId}-name`}>
                    {t('contact.name').toUpperCase()}
                  </label>
                  <input
                    id={`${fieldId}-name`}
                    name="name"
                    type="text"
                    required
                    maxLength={120}
                    autoComplete="name"
                    disabled={sending || !configured}
                    placeholder={t('contact.namePlaceholder')}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor={`${fieldId}-email`}>
                    {t('contact.email').toUpperCase()}
                  </label>
                  <input
                    id={`${fieldId}-email`}
                    name="email"
                    type="email"
                    required
                    maxLength={200}
                    autoComplete="email"
                    disabled={sending || !configured}
                    placeholder={t('contact.emailPlaceholder')}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor={`${fieldId}-company`}>
                    {t('contact.company').toUpperCase()}
                  </label>
                  <input
                    id={`${fieldId}-company`}
                    name="company"
                    type="text"
                    maxLength={120}
                    autoComplete="organization"
                    disabled={sending || !configured}
                    placeholder={t('contact.companyPlaceholder')}
                    className={fieldClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass} htmlFor={`${fieldId}-message`}>
                    {t('contact.message').toUpperCase()}
                  </label>
                  <textarea
                    id={`${fieldId}-message`}
                    name="message"
                    required
                    rows={3}
                    maxLength={2000}
                    disabled={sending || !configured}
                    placeholder={t('contact.messagePlaceholder')}
                    className={`${fieldClass} resize-none`}
                  />
                </div>
              </div>

              {!configured && (
                <p className="mt-10 max-w-[60ch] rounded-2xl bg-cream-soft p-5 text-[13px] leading-relaxed text-stone-soft">
                  {t('contact.notConfigured')}{' '}
                  <a
                    href={`mailto:${CONTACT_INBOX}`}
                    className="text-ink underline underline-offset-4"
                  >
                    {CONTACT_INBOX}
                  </a>
                  .
                </p>
              )}

              {status.kind === 'error' && (
                <p
                  role="alert"
                  className="mt-10 max-w-[60ch] rounded-2xl bg-cream-soft p-5 text-[13px] leading-relaxed text-stone-soft"
                >
                  {status.message} {t('contact.errorFallback')}{' '}
                  <a
                    href={`mailto:${CONTACT_INBOX}`}
                    className="text-ink underline underline-offset-4"
                  >
                    {CONTACT_INBOX}
                  </a>
                  .
                </p>
              )}

              <div className="mt-14 flex flex-wrap items-center gap-6">
                <button
                  type="submit"
                  disabled={sending || !configured}
                  className="group inline-flex items-center gap-4 rounded-full bg-ink px-8 py-5 text-[15px] font-medium text-cream transition-opacity duration-300 hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40 md:px-10 md:py-6 md:text-[16px]"
                >
                  {sending ? t('contact.sending') : t('contact.send')}
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1.5"
                  >
                    →
                  </span>
                </button>
                <p className="max-w-[28ch] text-[12px] leading-relaxed text-stone-soft">
                  {t('contact.reply')} {t('contact.privacy')}
                </p>
              </div>
            </form>
          )}
        </section>

        {/* --------------------------------------------- Blocos de contato */}
        <section className="border-t border-ink/10 px-6 py-16 md:px-10 md:py-20">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3"
          >
            <motion.div variants={fadeUp}>
              <p className={labelClass}>{t('contact.writeMe').toUpperCase()}</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-4 block break-words text-[clamp(1.1rem,2.4vw,1.6rem)] font-medium tracking-tight underline-offset-[6px] transition-opacity duration-300 hover:opacity-55 hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </motion.div>

            <motion.div variants={fadeUp}>
              <p className={labelClass}>{t('contact.whereIAm').toUpperCase()}</p>
              <p className="mt-4 text-[clamp(1.1rem,2.4vw,1.6rem)] font-medium tracking-tight">
                {t('contact.address')}
              </p>
              <p className="mt-3 max-w-[32ch] text-[14px] leading-relaxed text-stone-soft">
                {t('contact.remote')}
              </p>
            </motion.div>

            <motion.div variants={fadeUp}>
              <p className={labelClass}>{t('contact.followMe').toUpperCase()}</p>
              <ul className="mt-4 space-y-2">
                {SOCIALS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[17px] underline-offset-4 transition-opacity duration-300 hover:opacity-55 hover:underline"
                    >
                      {social.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </section>

        {/* ------------------------------------------------------- Rodapé */}
        <footer className="border-t border-ink/10">
          <div className="flex flex-col gap-4 px-6 py-10 text-[13px] text-stone-soft md:flex-row md:items-center md:justify-between md:px-10">
            <span>© {new Date().getFullYear()} John Amorim</span>
            <RouteTransitionLink
              href="/"
              className="tracking-[0.2em] transition-colors hover:text-ink"
            >
              ← {t('nav.backToGallery').toUpperCase()}
            </RouteTransitionLink>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
};

export default ContactPage;
