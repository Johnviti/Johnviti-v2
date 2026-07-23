/**
 * Depoimentos fictícios + faixa de manchetes satíricas em marquee
 * (equivalente à régua de "capas de revista" do original).
 */

const REVIEWS = [
  {
    stars: '5/5',
    quote:
      '"I put my mug on it and immediately felt seen. The mug felt seen. We were all seen."',
    name: 'MARINA T.',
    role: 'RECOVERING PRODUCTIVITY GURU',
  },
  {
    stars: '5/5',
    quote:
      '"Finally, a model that runs on my desk. Literally on the desk. Zero VRAM."',
    name: 'DIEGO S.',
    role: 'LOCAL LLM ENTHUSIAST',
  },
  {
    stars: '4.5/5',
    quote:
      '"Half a star off because it refused to hallucinate. I paid for AI, I demand confident nonsense."',
    name: 'PAT W.',
    role: 'PROMPT ENGINEER (SELF-DECLARED)',
  },
  {
    stars: '5/5',
    quote:
      '"My table has not felt this protected since I unplugged the smart speaker."',
    name: 'LEA F.',
    role: 'ANALOG MAXIMALIST',
  },
  {
    stars: '5/5',
    quote:
      '"Wore it as a hat during a video call. Got promoted. Correlation? Science says maybe."',
    name: 'RUI B.',
    role: 'MIDDLE MANAGER, ASCENDING',
  },
];

const HEADLINES = [
  'CORK IS THE NEW GPU',
  'TOP 10 DISCS DISRUPTING BEVERAGE-ADJACENT FURNITURE',
  'WE ARE SO CORKED',
  'THIS COASTER RAISED A ROUND (LITERALLY)',
  'ANALYSTS: TABLES HAVE NEVER BEEN SAFER',
];

export default function ReviewsSection() {
  return (
    <>
      <section id="testimonies" className="px-5 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span
                data-reveal
                className="font-archivo text-[10px] font-bold uppercase tracking-[0.28em] text-oryzo-orange"
              >
                Rating & reviews
              </span>
              <h2
                data-reveal
                className="mt-4 max-w-xl font-archivo text-[clamp(1.8rem,5vw,3.6rem)] font-black uppercase leading-none"
              >
                People all around the world love Corkzo
              </h2>
            </div>
            <div data-reveal className="text-right font-archivo">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-oryzo-tan">
                Custom reviews [ 217 ]
              </p>
              <p className="text-4xl font-black text-oryzo-orange">[ 4.9/5 ]</p>
            </div>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((r) => (
              <figure
                key={r.name}
                data-reveal
                className="flex flex-col justify-between rounded-3xl border border-oryzo-cream/15 p-7"
              >
                <div>
                  <span className="font-archivo text-[10px] font-bold tracking-[0.2em] text-oryzo-orange">
                    [ {r.stars} ]
                  </span>
                  <blockquote className="mt-4 font-literata text-base italic leading-relaxed text-oryzo-cream/90">
                    {r.quote}
                  </blockquote>
                </div>
                <figcaption className="mt-6 font-archivo text-[10px] font-bold uppercase tracking-[0.2em]">
                  {r.name}
                  <span className="mt-1 block font-medium text-oryzo-tan">
                    {r.role}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Manchetes em marquee */}
      <section
        id="social-content"
        className="overflow-hidden border-y border-oryzo-cream/15 py-6"
        aria-label="Manchetes satíricas"
      >
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap font-archivo text-sm font-extrabold uppercase tracking-[0.2em] text-oryzo-cream/80 motion-reduce:animate-none">
          {[...HEADLINES, ...HEADLINES].map((h, i) => (
            <span key={`${h}-${i}`} className="flex items-center gap-12">
              {h}
              <span aria-hidden className="text-oryzo-orange">
                ✳
              </span>
            </span>
          ))}
        </div>
      </section>
    </>
  );
}
