import CoasterCanvas from './CoasterCanvas';

/**
 * Hero: manchete display gigante, disco 3D ao centro e a linha em serifa
 * itálica que apresenta o produto fictício.
 */
export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 pt-24 pb-16 text-center"
    >
      <h1
        data-reveal
        className="font-archivo text-[clamp(2.6rem,9vw,7.5rem)] font-black uppercase leading-[0.92] tracking-tight"
      >
        Made for cups.
        <br />
        Raised on cork.
      </h1>

      <CoasterCanvas className="my-6 h-[300px] w-full max-w-[520px] md:h-[380px]" />

      <p
        data-reveal
        className="max-w-md font-literata text-[clamp(1.05rem,2.2vw,1.5rem)] italic leading-snug text-oryzo-cream/90"
      >
        The world's most gratuitously over&#8209;engineered cork coaster.
      </p>

      <p
        data-reveal
        className="mt-8 max-w-sm font-archivo text-[11px] font-medium uppercase leading-relaxed tracking-[0.2em] text-oryzo-tan"
      >
        Engineered to lift, insulate and grip — so an ordinary sip feels like a
        product launch.
      </p>

      <div
        data-reveal
        className="mt-12 font-archivo text-[10px] font-semibold uppercase tracking-[0.3em] text-oryzo-tan/70"
      >
        A design study — scroll to believe
        <span aria-hidden className="mt-3 block animate-bounce text-oryzo-orange">
          ↓
        </span>
      </div>
    </section>
  );
}
