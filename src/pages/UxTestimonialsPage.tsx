import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { testimonials, variations } from '@/data/ux-testimonials';
import '@/styles/ux-portfolio.css';

import Header from '@/components/ux/Header';
import Footer from '@/components/ux/Footer';
import ScrollProgress from '@/components/ux/ScrollProgress';
import SectionHeader from '@/components/ux/SectionHeader';
import Reveal from '@/components/ux/Reveal';
import { Container, Eyebrow, Rule } from '@/components/ux/primitives';

import TestimonialFeatured from '@/components/ux/testimonials/TestimonialFeatured';
import TestimonialSplit from '@/components/ux/testimonials/TestimonialSplit';
import TestimonialMinimal from '@/components/ux/testimonials/TestimonialMinimal';
import TestimonialCarousel from '@/components/ux/testimonials/TestimonialCarousel';
import TestimonialGrid from '@/components/ux/testimonials/TestimonialGrid';
import TestimonialMetric from '@/components/ux/testimonials/TestimonialMetric';

/**
 * Catálogo das variações de card de depoimento.
 *
 * Cada bloco mostra o componente real sobre o fundo em que ele foi pensado para
 * viver, com a descrição de quando usar e a assinatura das props — mesma
 * estética da documentação do design system.
 */
export default function UxTestimonialsPage() {
  useDocumentMeta({
    title: 'Depoimentos — variações de card · John Amorim',
    description:
      'Seis variações de card de depoimento do design system: destaque, dividido, mínimo, carrossel, grade e com métrica.',
    path: '/ux/depoimentos',
  });

  const spec = (id: string) => variations.find((v) => v.id === id)!;

  return (
    <div className="ux-root min-h-svh">
      <ScrollProgress />
      <Header />

      <main id="conteudo">
        <section className="pt-[120px] md:pt-[152px]">
          <Container>
            <Reveal>
              <Eyebrow tone="primary">Design system — componentes</Eyebrow>
              <h1 className="mt-5 max-w-[18ch] text-[40px] font-semibold leading-[1.03] tracking-[-0.04em] sm:text-[56px]">
                Variações de depoimento
              </h1>
              <p className="mt-6 max-w-[56ch] text-[17px] leading-[1.62] text-[var(--color-muted)] md:text-[18px]">
                Seis formatos para a mesma informação. A escolha não é estética: depende de quanta
                atenção o depoimento merece na página e de haver ou não imagem, número e volume de
                falas para sustentar o formato.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <Rule className="mt-14" />
              <ol className="grid gap-x-8 gap-y-4 py-6 sm:grid-cols-2 lg:grid-cols-3">
                {variations.map((variation, index) => (
                  <li key={variation.id}>
                    <a
                      href={`#${variation.id}`}
                      className="ux-link inline-flex items-baseline gap-3 text-[15px] transition-colors duration-200 hover:text-[var(--color-primary)]"
                    >
                      <span className="font-mono text-[12px] text-[var(--color-muted)]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {variation.name}
                    </a>
                  </li>
                ))}
              </ol>
              <Rule />
            </Reveal>
          </Container>
        </section>

        <Variation spec={spec('destaque')} number="01">
          <TestimonialFeatured
            company={testimonials[0].company}
            quote={testimonials[0].quote}
            highlightedText={testimonials[0].highlightedText}
            authorName={testimonials[0].authorName}
            authorPosition={testimonials[0].authorPosition}
            authorImage={testimonials[0].authorImage}
          />
        </Variation>

        <Variation spec={spec('dividido')} number="02">
          <div className="space-y-6">
            <TestimonialSplit testimonial={testimonials[1]} />
            <TestimonialSplit testimonial={testimonials[2]} reverse />
          </div>
        </Variation>

        <Variation spec={spec('minimo')} number="03">
          <div className="space-y-16">
            <TestimonialMinimal testimonial={testimonials[4]} />
            <TestimonialMinimal testimonial={testimonials[5]} align="center" />
          </div>
        </Variation>

        <Variation spec={spec('carrossel')} number="04">
          <TestimonialCarousel testimonials={testimonials.slice(0, 4)} />
        </Variation>

        <Variation spec={spec('grade')} number="05">
          <TestimonialGrid testimonials={testimonials.slice(0, 6)} />
        </Variation>

        <Variation spec={spec('metrica')} number="06">
          <div className="space-y-6">
            <TestimonialMetric testimonial={testimonials[0]} />
            <TestimonialMetric testimonial={testimonials[3]} />
          </div>
        </Variation>

        {/* --------------------------------------------------- como escolher */}
        <section className="py-24 md:py-32" aria-labelledby="escolha-title">
          <Container>
            <SectionHeader
              id="escolha-title"
              eyebrow="Critério"
              title="Como escolher a variação"
              description="Na dúvida entre duas, escolha a que exige menos do conteúdo: card vazio de informação chama mais atenção para o vazio do que para a fala."
            />
            {/* A tabela rola dentro do próprio card no mobile — o `overflow-hidden`
                do card arredondado cortaria as colunas em silêncio. */}
            <Reveal className="ux-scroller mt-14 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
              <table className="w-full min-w-[620px] border-collapse text-left text-[14px]">
                <caption className="sr-only">
                  Quando usar cada variação de depoimento
                </caption>
                <thead>
                  <tr className="bg-[var(--color-background)]">
                    {['Variação', 'Use quando', 'Exige'].map((head) => (
                      <th
                        key={head}
                        scope="col"
                        className="px-5 py-3.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-muted)]"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Destaque', 'Existe uma fala claramente mais forte', 'Uma citação de peso'],
                    ['Dividido', 'Há foto real do produto em uso', 'Imagem de contexto'],
                    ['Mínimo', 'O depoimento entra no meio de um texto', 'Nada além da fala'],
                    ['Carrossel', 'Há muitas falas equivalentes', 'Quatro ou mais depoimentos'],
                    ['Grade', 'O volume é o argumento', 'Falas curtas e parecidas em tamanho'],
                    ['Com métrica', 'O dado precisa de testemunha', 'Número medido e verificável'],
                  ].map(([name, when, needs]) => (
                    <tr key={name} className="border-t border-[var(--color-border)] align-top">
                      <td className="px-5 py-4 font-medium">{name}</td>
                      <td className="px-5 py-4 text-[var(--color-muted)]">{when}</td>
                      <td className="px-5 py-4">{needs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/**
 * Moldura de cada variação: cabeçalho documental + a demonstração.
 *
 * O palco é o próprio fundo da página — os cards são brancos, então qualquer
 * caixa cinza extra atrás deles só criaria uma borda a mais para explicar.
 */
function Variation({
  spec,
  number,
  children,
}: {
  spec: { id: string; name: string; description: string; props: string };
  number: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={spec.id}
      className="scroll-mt-24 border-t border-[var(--color-border)] py-16 md:py-20"
    >
      <Container>
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[52ch]">
            <Eyebrow>{`${number} — Variação`}</Eyebrow>
            <h2 className="mt-3 text-[26px] font-semibold tracking-[-0.03em] sm:text-[32px]">
              {spec.name}
            </h2>
            <p className="mt-3 text-[15px] leading-[1.6] text-[var(--color-muted)]">
              {spec.description}
            </p>
          </div>
          <code className="shrink-0 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 font-mono text-[11px] leading-[1.6] text-[var(--color-muted)] md:max-w-[30ch]">
            {spec.props}
          </code>
        </Reveal>

        <div className="mt-10">{children}</div>
      </Container>
    </section>
  );
}
