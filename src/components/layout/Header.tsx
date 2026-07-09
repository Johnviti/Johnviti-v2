import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/context';
import { useAppReady } from '../../context/app-ready';
import { useScrollTo } from '../../hooks/useLenis';

const SECTIONS = [
  { key: 'nav.work', target: '#work' },
  { key: 'nav.about', target: '#about' },
  { key: 'nav.contact', target: '#contact' },
];

// text-base + mix-blend-difference: escuro sobre fundo claro, claro sobre o footer escuro.
export function Header() {
  const { t, locale, toggle } = useI18n();
  const ready = useAppReady();
  const scrollTo = useScrollTo();
  const location = useLocation();
  const navigate = useNavigate();

  const goTo = (target: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: target } });
    } else {
      scrollTo(target);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={ready ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between px-5 mix-blend-difference md:px-10"
    >
      <Link
        to="/"
        aria-label="John Amorim — home"
        className="tech-label text-base transition-opacity hover:opacity-60"
      >
        John Amorim<span className="opacity-50">©</span>
      </Link>

      <nav aria-label="Principal" className="flex items-center gap-5 md:gap-8">
        {SECTIONS.map(({ key, target }) => (
          <button
            key={key}
            type="button"
            onClick={() => goTo(target)}
            className="tech-label cursor-pointer text-base opacity-60 transition-opacity hover:opacity-100"
          >
            {t(key)}
          </button>
        ))}

        <button
          type="button"
          onClick={toggle}
          aria-label={locale === 'pt' ? 'Switch to English' : 'Mudar para português'}
          className="tech-label cursor-pointer rounded-full border border-base/40 px-3 py-1.5 text-base transition-colors hover:border-base"
        >
          <span className={locale === 'pt' ? 'opacity-100' : 'opacity-50'}>PT</span>
          <span className="opacity-50"> / </span>
          <span className={locale === 'en' ? 'opacity-100' : 'opacity-50'}>EN</span>
        </button>
      </nav>
    </motion.header>
  );
}
