import { useState } from 'react';

/**
 * "Criptografia" de virar o disco: escreva uma mensagem, ENCODE vira o
 * cartão (texto de cabeça para baixo = "seguro"), DECODE desvira.
 */
export default function EncryptionSection() {
  const [message, setMessage] = useState('the wifi password is under the mug');
  const [encoded, setEncoded] = useState(false);

  return (
    <section id="encryption" className="px-5 py-24 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <span
          data-reveal
          className="font-archivo text-[10px] font-bold uppercase tracking-[0.28em] text-oryzo-orange"
        >
          Secure communications, simplified
        </span>
        <h2
          data-reveal
          className="mt-4 font-archivo text-[clamp(1.8rem,5.5vw,4rem)] font-black uppercase leading-none"
        >
          Smart flip
          <br />
          encryption
        </h2>
        <p
          data-reveal
          className="mx-auto mt-6 max-w-md font-literata text-base italic leading-relaxed text-oryzo-tan"
        >
          Write a note. Flip the coaster. The message is now upside down —
          therefore unreadable — therefore encrypted. Military-grade, if the
          military is five years old.
        </p>

        <div data-reveal className="mt-12">
          <div
            className="mx-auto flex h-44 w-full max-w-md items-center justify-center rounded-3xl border border-oryzo-cream/20 bg-oryzo-cream/5 px-8 transition-transform duration-700 [transform-style:preserve-3d]"
            style={{ transform: encoded ? 'rotateX(180deg)' : 'none' }}
          >
            <p
              className="font-literata text-lg italic text-oryzo-cream"
              style={{ transform: encoded ? 'rotateX(180deg) scaleY(-1)' : 'none' }}
            >
              {message || '…'}
            </p>
          </div>

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={48}
            aria-label="Mensagem para criptografar"
            className="mt-6 w-full max-w-md rounded-full border border-oryzo-cream/25 bg-transparent px-6 py-3 text-center font-archivo text-sm text-oryzo-cream outline-none placeholder:text-oryzo-tan/50 focus:border-oryzo-orange"
            placeholder="type a very secret message"
          />

          <div className="mt-5 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setEncoded(true)}
              className="rounded-full bg-oryzo-orange px-6 py-2.5 font-archivo text-[10px] font-bold uppercase tracking-[0.22em] text-oryzo-bg transition-transform duration-200 hover:scale-105"
            >
              Encode message
            </button>
            <button
              type="button"
              onClick={() => setEncoded(false)}
              className="rounded-full border border-oryzo-cream/30 px-6 py-2.5 font-archivo text-[10px] font-bold uppercase tracking-[0.22em] text-oryzo-cream transition-colors duration-200 hover:border-oryzo-cream"
            >
              Decode message
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
