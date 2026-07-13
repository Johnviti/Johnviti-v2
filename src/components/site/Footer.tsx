import { motion } from 'framer-motion';
import { CONTACT_EMAIL, SOCIALS, VERSIONS } from '@/data/site';

export const Footer = () => {
  return (
    <footer id="contato" className="scroll-mt-24 bg-charcoal text-cream">
      <div className="px-5 py-24 md:px-8 md:py-32">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(2.5rem,8vw,7.5rem)] font-medium leading-[1.02] tracking-[-0.03em]"
        >
          Vamos trabalhar juntos!
        </motion.h2>

        <div className="mt-12 grid grid-cols-1 gap-12 md:mt-20 md:grid-cols-2">
          <p className="max-w-md text-lg leading-relaxed text-cream/70 md:text-xl">
            Tem uma ideia — ou só precisa tirar algo do papel? Me manda uma
            mensagem e a gente conversa.
          </p>

          <div className="flex flex-col items-start gap-6 md:items-end">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="break-all text-xl font-medium underline decoration-1 underline-offset-8 transition-opacity hover:opacity-60 md:text-2xl"
            >
              {CONTACT_EMAIL}
            </a>
            <nav className="flex gap-6 text-sm text-cream/70">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-cream"
                >
                  {social.label} ↗
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-24 border-t border-cream/15 pt-6 text-sm text-cream/50">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>outras versões:</span>
            {VERSIONS.filter((v) => v.path !== '/').map((version) => (
              <a
                key={version.path}
                href={version.path}
                className="underline decoration-1 underline-offset-4 transition-colors hover:text-cream"
              >
                {version.label}
              </a>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <span>© {new Date().getFullYear()} john amorim</span>
            <span>Maceió, Brasil — feito com um toque de encanto ✦</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
