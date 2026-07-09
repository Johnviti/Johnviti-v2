interface MarqueeProps {
  items: string[];
}

// Faixa de texto infinita — conteúdo duplicado para o loop; a cópia é aria-hidden.
export function Marquee({ items }: MarqueeProps) {
  const strip = (hidden: boolean) => (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="px-6 font-display text-[clamp(1.5rem,3.5vw,3rem)] font-medium tracking-tight uppercase md:px-10">
            {item}
          </span>
          <span aria-hidden className="text-accent">
            ✳
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden border-y border-line py-5">
      <div className="marquee-track">
        {strip(false)}
        {strip(true)}
      </div>
    </div>
  );
}
