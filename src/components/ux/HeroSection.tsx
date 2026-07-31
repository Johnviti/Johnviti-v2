import { MapPin, Circle, Compass } from 'lucide-react';
import { profile, projects } from '@/data/ux-portfolio';
import { Container, Grid, Eyebrow, ButtonLink, Rule } from './primitives';
import Reveal from './Reveal';
import Img from './Img';

/**
 * Abertura do portfólio: composição assimétrica com título grande à esquerda e
 * o projeto em destaque ocupando as colunas da direita.
 */
export default function HeroSection() {
  const featured = projects.find((p) => p.featured) ?? projects[0];

  return (
    <section className="pt-[120px] md:pt-[152px]" aria-labelledby="hero-title">
      <Container>
        <Grid className="items-end">
          <div className="col-span-4 md:col-span-8 lg:col-span-7">
            <Reveal>
              <Eyebrow tone="primary">{profile.role}</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h1
                id="hero-title"
                className="mt-6 text-[38px] font-semibold leading-[1.03] tracking-[-0.04em] sm:text-[56px] lg:text-[64px]"
              >
                {profile.headline}
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-8 max-w-[52ch] text-[17px] leading-[1.62] text-[var(--color-muted)] md:text-[18px]">
                {profile.intro}
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <ButtonLink href="#projetos" size="lg">
                  Ver projetos
                </ButtonLink>
                <ButtonLink href="#sobre" size="lg" variant="secondary">
                  Sobre mim
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          <div className="col-span-4 mt-14 md:col-span-8 lg:col-span-5 lg:mt-0">
            <Reveal delay={0.1}>
              <figure className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                <a
                  href={`/ux/${featured.slug}`}
                  className="group block overflow-hidden rounded-[var(--radius-lg)]"
                >
                  <span className="relative block overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-border)]/40">
                    <Img
                      src={featured.heroImage.src}
                      alt={featured.heroImage.alt}
                      aspect={1.6}
                      priority
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                    />
                  </span>
                </a>
                <figcaption className="flex items-end justify-between gap-4 px-2 pb-1 pt-4">
                  <div>
                    <Eyebrow>Projeto em destaque</Eyebrow>
                    <p className="mt-2 text-[15px] font-semibold tracking-[-0.01em]">
                      {featured.projectSummary.project.title}
                    </p>
                  </div>
                  <span className="text-[13px] text-[var(--color-muted)]">
                    {featured.projectSummary.project.year}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </Grid>

        <Reveal delay={0.24}>
          <Rule className="mt-16 md:mt-20" />
          <dl className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-3">
            <Indicator icon={Compass} label="Área de atuação" value={profile.focus} />
            <Indicator icon={MapPin} label="Localização" value={profile.location} />
            <Indicator
              icon={Circle}
              label="Disponibilidade"
              value={profile.availability}
              accent
            />
          </dl>
          <Rule />
        </Reveal>
      </Container>
    </section>
  );
}

function Indicator({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon
        size={16}
        strokeWidth={1.5}
        aria-hidden="true"
        className={
          accent
            ? 'mt-0.5 shrink-0 fill-[var(--color-secondary)] text-[var(--color-secondary)]'
            : 'mt-0.5 shrink-0 text-[var(--color-muted)]'
        }
      />
      <div>
        <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-muted)]">
          {label}
        </dt>
        <dd className="mt-1 text-[14px] leading-[1.45]">{value}</dd>
      </div>
    </div>
  );
}
