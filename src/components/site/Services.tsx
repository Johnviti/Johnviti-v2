import { motion } from 'framer-motion';
import { SERVICES } from '@/data/site';

export const Services = () => {
  return (
    <section id="servicos" className="scroll-mt-24 px-5 py-24 md:px-8 md:py-32">
      <h2 className="mb-10 border-b border-ink/15 pb-5 text-sm font-medium uppercase tracking-wide text-stone-soft">
        Serviços
      </h2>

      <div>
        {SERVICES.map((service, i) => (
          <motion.article
            key={service.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`grid grid-cols-1 gap-6 py-12 md:grid-cols-12 md:gap-8 md:py-16 ${
              i > 0 ? 'border-t border-ink/10' : ''
            }`}
          >
            <span className="text-sm tabular-nums text-stone-soft md:col-span-1">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="text-[clamp(1.75rem,4vw,3.25rem)] font-medium leading-tight tracking-[-0.02em] md:col-span-5">
              {service.title}
            </h3>
            <div className="md:col-span-6">
              <p className="max-w-xl text-lg leading-relaxed text-ink/80">
                {service.description}
              </p>
              <p className="mt-6 text-sm text-stone-soft">
                {service.tags.join(' / ')}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};
