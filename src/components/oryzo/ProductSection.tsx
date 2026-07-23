import CoasterCanvas from './CoasterCanvas';

/**
 * Escolha do modelo: três variações (1, 2 e 3 discos) com descrição,
 * destaques e tabela comparativa de especificações absurdas.
 */

const TIERS = [
  {
    name: 'CORKZO',
    stack: 1,
    blurb:
      'The original. One disc, one purpose, zero settings. It lifts just enough and then gets out of the way.',
    highlights: ['Single-layer lift', 'Natural cork insulation', 'Grips everyday surfaces'],
  },
  {
    name: 'CORKZO PRO',
    stack: 2,
    blurb:
      'Twice the cork, twice the conviction. For mugs with something to prove and desks with room to grow.',
    highlights: ['Double-stack lift', 'More mass, more calm', 'Extra insulation by design'],
  },
  {
    name: 'CORKZO PRO MAX',
    stack: 3,
    blurb:
      'A small pedestal for your beverage and a quiet flex for the entire room. Maximum height, maximum whimsy.',
    highlights: ['Triple-stack lift', 'Engineered to stand out', 'Runs fine next to any GPU'],
  },
];

const SPEC_ROWS: { label: string; values: [string, string, string] }[] = [
  { label: 'STACK', values: ['1', '2', '3'] },
  { label: 'LIFT', values: ['1 COASTER THICK', '2 COASTERS THICK', '3 COASTERS THICK'] },
  { label: 'MATERIAL', values: ['CORK', 'CORK', 'CORK'] },
  { label: 'BATTERY', values: ['N/A — RUNS ON GRAVITY', 'N/A — RUNS ON GRAVITY', 'N/A — RUNS ON GRAVITY'] },
  { label: 'PAIRING', values: ['WALK UP AND USE', 'WALK UP AND USE', 'WALK UP AND USE'] },
  { label: 'FIRMWARE', values: ['FINAL', 'FINAL', 'FINAL'] },
  { label: 'UPDATES', values: ['NEVER — IT SHIPPED DONE', 'NEVER — IT SHIPPED DONE', 'NEVER — IT SHIPPED DONE'] },
  {
    label: 'BEST FOR',
    values: ['QUIET DESKS, DAILY MUGS', 'TALL CUPS, EXTRA STABILITY', 'MAXIMUM LIFT, MAXIMUM PRESENCE'],
  },
];

export default function ProductSection() {
  return (
    <section id="product" className="px-5 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <h2
          data-reveal
          className="text-center font-archivo text-[clamp(2rem,6vw,4.5rem)] font-black uppercase leading-none"
        >
          Choose your
          <br />
          Corkzo
        </h2>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {TIERS.map((tier) => (
            <article
              key={tier.name}
              data-reveal
              className="flex flex-col rounded-3xl border border-oryzo-cream/15 p-8"
            >
              <CoasterCanvas stack={tier.stack} className="h-40 w-full" />
              <span className="mt-6 w-fit rounded-full bg-oryzo-orange/15 px-3 py-1 font-archivo text-[9px] font-bold uppercase tracking-[0.24em] text-oryzo-orange">
                New
              </span>
              <h3 className="mt-3 font-archivo text-xl font-extrabold uppercase tracking-wide">
                {tier.name}
              </h3>
              <p className="mt-3 flex-1 font-literata text-sm italic leading-relaxed text-oryzo-tan">
                {tier.blurb}
              </p>
              <ul className="mt-6 space-y-2 border-t border-oryzo-cream/10 pt-5">
                {tier.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-center gap-2 font-archivo text-[10px] font-semibold uppercase tracking-[0.18em] text-oryzo-cream/80"
                  >
                    <span aria-hidden className="text-oryzo-orange">
                      ●
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Tabela comparativa */}
        <div data-reveal className="mt-16 overflow-x-auto rounded-3xl border border-oryzo-cream/15">
          <table className="w-full min-w-[640px] border-collapse font-archivo text-left">
            <thead>
              <tr className="border-b border-oryzo-cream/15">
                <th className="p-5 text-[9px] font-bold uppercase tracking-[0.24em] text-oryzo-tan">
                  Spec
                </th>
                {TIERS.map((t) => (
                  <th
                    key={t.name}
                    className="p-5 text-[11px] font-extrabold uppercase tracking-[0.18em]"
                  >
                    {t.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SPEC_ROWS.map((row) => (
                <tr key={row.label} className="border-b border-oryzo-cream/10 last:border-b-0">
                  <th className="p-5 text-[9px] font-bold uppercase tracking-[0.24em] text-oryzo-orange">
                    {row.label}
                  </th>
                  {row.values.map((v, i) => (
                    <td
                      key={`${row.label}-${i}`}
                      className="p-5 text-[10px] font-medium uppercase tracking-[0.14em] text-oryzo-cream/85"
                    >
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
