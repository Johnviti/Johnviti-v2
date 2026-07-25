import { useCallback, useId, useRef, useState } from 'react';
import { motion, MotionConfig, type Variants } from 'framer-motion';
import { Menu } from 'lucide-react';
import Logo from '@/components/Logo';
import GalleryMenu from '@/components/galeria-imersiva/GalleryMenu';
import { RouteTransitionLink } from '@/components/loader/ContactTransition';
import GrainOverlay from '@/components/ui/GrainOverlay';
import IconTooltip from '@/components/ui/IconTooltip';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import LanguageToggle from '@/components/ui/LanguageToggle';
import SkipLink from '@/components/ui/SkipLink';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { CONTACT_EMAIL, CONTACT_INBOX, CV_URL, SOCIALS } from '@/data/site';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { useI18n, type Lang } from '@/lib/i18n';

/**
 * Página de contato — estrutura inspirada em cuberto.com/contacts: um título
 * enorme e conversado, o pedido montado por chips (o que você precisa e quanto
 * pretende investir) e só então os campos de texto. Os blocos de e-mail,
 * localização e redes fecham a página.
 *
 * O envio usa o mesmo Web3Forms do resto do site: a chave é pública por design
 * (ela só autoriza o envio para uma caixa já fixada). Sem chave, o envio abre
 * o cliente de e-mail com o conteúdo do formulário.
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

  const sending = status.kind === 'sending';

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  useDocumentMeta({
    title: lang === 'pt' ? 'John Amorim - Contato' : 'John Amorim - Contact',
    description: t('contact.lead'),
    path: '/contato',
  });

  const toggleService = (id: string) =>
    setServices((current) =>
      current.includes(id) ? current.filter((s) => s !== id) : [...current, id],
    );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

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

      const name = String(data.get('name') ?? '');
      const email = String(data.get('email') ?? '');
      const company = String(data.get('company') ?? '') || '—';
      const message = String(data.get('message') ?? '');

      // Sem chave Web3Forms: abre o cliente de e-mail com o conteúdo do formulário.
      if (!ACCESS_KEY) {
        const body = [
          `Nome: ${name}`,
          `E-mail: ${email}`,
          `Empresa: ${company}`,
          `Serviços: ${chosenServices || '—'}`,
          `Orçamento: ${chosenBudget}`,
          '',
          message,
        ].join('\n');
        window.location.href = `mailto:${CONTACT_INBOX}?subject=${encodeURIComponent(
          `Contato pelo portfólio — ${name}`,
        )}&body=${encodeURIComponent(body)}`;
        return;
      }

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
            subject: `Contato pelo portfólio — ${name}`,
            from_name: 'Portfólio John Amorim',
            name,
            email,
            company,
            services: chosenServices || '—',
            budget: chosenBudget,
            message,
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

  // Campos "preenchidos": fundo cream-soft (acompanha o tema), cantos
  // arredondados e um anel de foco visível — em vez do antigo underline.
  const fieldClass =
    'mt-3 w-full rounded-2xl border border-ink/10 bg-cream-soft px-5 py-4 text-[16px] outline-none transition-[border-color,box-shadow] placeholder:text-stone-soft/60 focus:border-ink/60 focus:ring-2 focus:ring-ink/15 disabled:opacity-50 md:text-[17px]';
  // Rótulos dos campos e das seções — maiores e em negrito (referência).
  const fieldLabelClass =
    'block text-[16px] font-semibold tracking-tight text-ink md:text-[18px]';
  // Eyebrow pequeno (usado no topo e nos blocos de contato do rodapé).
  const labelClass = 'text-[10px] tracking-[0.28em] text-stone-soft';

  const chipClass = (active: boolean) =>
    `rounded-full border px-4 py-2.5 text-[13px] transition-colors duration-300 md:text-[14px] ${
      active
        ? 'border-ink bg-ink text-cream'
        : 'border-ink/20 text-ink hover:border-ink/60'
    }`;

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative isolate min-h-svh bg-surface text-ink">
        <SkipLink />
        <GrainOverlay />
        <WhatsAppButton className="fixed bottom-4 right-4 z-40 md:bottom-6 md:right-6" />
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
            <IconTooltip label={t('nav.openMenu')}>
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
            </IconTooltip>
          </div>
        </motion.header>

        <GalleryMenu open={menuOpen} onClose={closeMenu} />

        {/* --------------------------------------------------------- Hero */}
        <section
          id="conteudo"
          tabIndex={-1}
          className="px-6 pt-32 outline-none md:px-10 md:pt-44"
        >
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
          {/* Anuncia o resultado do envio a leitores de tela sem mover o foco. */}
          <p role="status" aria-live="polite" className="sr-only">
            {status.kind === 'sending'
              ? t('contact.sending')
              : status.kind === 'sent'
                ? `${t('contact.sentTitle')} ${t('contact.sentBody')}`
                : status.kind === 'error'
                  ? status.message
                  : ''}
          </p>
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
                <legend className={fieldLabelClass}>
                  {t('contact.servicesLabel')}
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
                <legend className={fieldLabelClass}>
                  {t('contact.budgetLabel')}
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
                  <label className={fieldLabelClass} htmlFor={`${fieldId}-name`}>
                    {t('contact.name')}
                  </label>
                  <input
                    id={`${fieldId}-name`}
                    name="name"
                    type="text"
                    required
                    maxLength={120}
                    autoComplete="name"
                    disabled={sending}
                    placeholder={t('contact.namePlaceholder')}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className={fieldLabelClass} htmlFor={`${fieldId}-email`}>
                    {t('contact.email')}
                  </label>
                  <input
                    id={`${fieldId}-email`}
                    name="email"
                    type="email"
                    required
                    maxLength={200}
                    autoComplete="email"
                    disabled={sending}
                    placeholder={t('contact.emailPlaceholder')}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className={fieldLabelClass} htmlFor={`${fieldId}-company`}>
                    {t('contact.company')}
                  </label>
                  <input
                    id={`${fieldId}-company`}
                    name="company"
                    type="text"
                    maxLength={120}
                    autoComplete="organization"
                    disabled={sending}
                    placeholder={t('contact.companyPlaceholder')}
                    className={fieldClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={fieldLabelClass} htmlFor={`${fieldId}-message`}>
                    {t('contact.message')}
                  </label>
                  <textarea
                    id={`${fieldId}-message`}
                    name="message"
                    required
                    rows={3}
                    maxLength={2000}
                    disabled={sending}
                    placeholder={t('contact.messagePlaceholder')}
                    className={`${fieldClass} resize-none`}
                  />
                </div>
              </div>

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
                  disabled={sending}
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
            className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4"
          >
            <motion.div variants={fadeUp}>
              <p className={labelClass}>{t('contact.writeMe').toUpperCase()}</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-4 block break-words text-[clamp(1.1rem,2.4vw,1.6rem)] font-medium tracking-tight underline-offset-[6px] transition-opacity duration-300 hover:opacity-55 hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
              <p className="mt-4 text-[13px] text-stone-soft">
                © {new Date().getFullYear()} John Amorim
              </p>
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

            <motion.div variants={fadeUp}>
              <p className={labelClass}>{t('contact.siteLinks').toUpperCase()}</p>
              <ul className="mt-4 space-y-2">
                <li>
                  <RouteTransitionLink
                    href="/"
                    className="text-[17px] underline-offset-4 transition-opacity duration-300 hover:opacity-55 hover:underline"
                  >
                    {t('nav.gallery')}
                  </RouteTransitionLink>
                </li>
                <li>
                  <a
                    href="/minimal"
                    className="text-[17px] underline-offset-4 transition-opacity duration-300 hover:opacity-55 hover:underline"
                  >
                    {t('contact.simpleVersion')}
                  </a>
                </li>
                <li>
                  <a
                    href={CV_URL}
                    download
                    className="text-[17px] underline-offset-4 transition-opacity duration-300 hover:opacity-55 hover:underline"
                  >
                    {t('nav.resume')}
                  </a>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </MotionConfig>
  );
};

export default ContactPage;
