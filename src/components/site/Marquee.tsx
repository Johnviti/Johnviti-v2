const ITEMS = ['Disponível para novos projetos', 'Vamos conversar?'];

export const Marquee = () => {
  const sequence = [...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <div className="overflow-hidden border-y border-ink/10 py-5" aria-hidden="true">
      <div className="animate-marquee flex w-max">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center">
            {sequence.map((item, i) => (
              <span
                key={`${half}-${i}`}
                className="flex items-center gap-6 pr-6 text-lg font-medium md:text-xl"
              >
                {item}
                <svg viewBox="0 0 100 100" className="h-4 w-4" fill="currentColor">
                  <path d="M50 0 C55 30 70 45 100 50 C70 55 55 70 50 100 C45 70 30 55 0 50 C30 45 45 30 50 0 Z" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
