import { useState } from 'react';
import type { CaseTestimonial } from '@/data/ux-portfolio';
import { Container, Grid } from './primitives';
import Reveal from './Reveal';
import Img from './Img';

/**
 * Depoimento do dono do case — blocos 19 a 21:
 *
 *   19 imagem da pessoa (grande, no topo)
 *   20 texto do depoimento
 *   21 nome, cargo, empresa e avatar
 *
 * Composição editorial: imagem grande em cima, citação abaixo. Sem foto de
 * avatar, cai para as iniciais.
 */
export default function TestimonialCard({ testimonial }: { testimonial: CaseTestimonial }) {
  return (
    <section id="depoimento" className="scroll-mt-24 py-24 md:py-32">
      <Container>
        <Reveal>
          <figure className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)]">
            {/* 19 — imagem da pessoa / contexto */}
            <Img
              src={testimonial.image.src}
              alt={testimonial.image.alt}
              aspect={2.4}
              sizes="(min-width: 1024px) 80vw, 100vw"
              wrapperClassName="w-full"
            />

            <div className="p-6 md:p-12">
              <Grid>
                {/* 20 — texto do depoimento */}
                <blockquote className="col-span-4 md:col-span-8 lg:col-span-8">
                  <p
                    className="text-[22px] leading-[1.35] tracking-[-0.01em] md:text-[30px]"
                    style={{ fontFamily: 'var(--font-editorial)' }}
                  >
                    “{testimonial.quote}”
                  </p>
                </blockquote>

                {/* 21 — nome, cargo, empresa e avatar */}
                <figcaption className="col-span-4 mt-8 md:col-span-8 lg:col-span-4 lg:mt-0 lg:pl-8">
                  <div className="flex items-center gap-4 lg:flex-col lg:items-start">
                    <Avatar
                      name={testimonial.author.name}
                      src={testimonial.author.avatar.src}
                      alt={testimonial.author.avatar.alt}
                    />
                    <div className="lg:mt-4">
                      <p className="text-[15px] font-semibold tracking-[-0.01em]">
                        {testimonial.author.name}
                      </p>
                      <p className="mt-1 text-[13px] leading-[1.45] text-[var(--color-muted)]">
                        {testimonial.author.role}
                        <br />
                        {testimonial.author.company}
                      </p>
                    </div>
                  </div>

                  <svg
                    aria-hidden="true"
                    viewBox="0 0 160 34"
                    className="mt-8 h-8 w-40 text-[var(--color-border)]"
                    fill="none"
                  >
                    <path
                      d="M2 26c14-4 20-22 27-22s2 24 12 24 12-20 20-20 4 18 13 18 16-10 24-14 20-6 26-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </figcaption>
              </Grid>
            </div>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}

/**
 * Avatar da pessoa: foto quando carrega, iniciais como fallback (as imagens
 * reaproveitadas não são retratos reais).
 */
function Avatar({ name, src, alt }: { name: string; src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (src && !failed) {
    return (
      <span className="relative block size-12 shrink-0 overflow-hidden rounded-full bg-[var(--color-border)]">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[16px] font-semibold text-[var(--color-primary)]"
    >
      {initials}
    </span>
  );
}
