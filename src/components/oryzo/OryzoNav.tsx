const links = [
  { href: '#hero', label: 'INTRO' },
  { href: '#features', label: 'FEATURES' },
  { href: '#product', label: 'PRODUCT' },
  { href: '#contact', label: 'CONTACT' },
];

/** Navegação fixa: marca à esquerda, âncoras à direita. */
export default function OryzoNav() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 font-archivo text-oryzo-cream mix-blend-difference md:px-8 md:py-5">
      <a
        href="#hero"
        className="pointer-events-auto text-[13px] font-extrabold tracking-[0.18em]"
      >
        CORKZO®
      </a>

      <nav className="pointer-events-auto hidden items-center gap-6 text-[10px] font-semibold tracking-[0.24em] md:flex">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="text-oryzo-cream/70 transition-colors duration-300 hover:text-oryzo-cream"
          >
            {l.label}
          </a>
        ))}
        <a
          href="#open-weight"
          className="rounded-full border border-oryzo-cream/40 px-3.5 py-1.5 transition-colors duration-300 hover:border-oryzo-cream"
        >
          CORKZO-1 MODEL
        </a>
      </nav>
    </header>
  );
}
