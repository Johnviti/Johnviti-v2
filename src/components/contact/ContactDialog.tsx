import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { CONTACT_INBOX } from '@/data/site';

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * Formulário de contato em modal.
 *
 * O envio vai para o Web3Forms, que repassa a mensagem para a caixa cadastrada
 * na chave de acesso. A chave é pública por design — ela só autoriza o envio
 * para um destino já fixado — então pode viajar no bundle sem risco.
 *
 * Sem chave, o envio abre o cliente de e-mail com o conteúdo do formulário.
 */

const ENDPOINT = 'https://api.web3forms.com/submit';
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim();

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'error'; message: string };

export default function ContactDialog({ open, onClose }: Props) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const formRef = useRef<HTMLFormElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const fieldId = useId();

  /* Escape fecha; o foco entra no primeiro campo ao abrir. */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const focusTimer = window.setTimeout(
      () => firstFieldRef.current?.focus(),
      120,
    );

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [open, onClose]);

  /* Reabrir depois de um envio bem-sucedido começa um formulário limpo. */
  useEffect(() => {
    if (open) return;
    const reset = window.setTimeout(() => {
      setStatus((current) => (current.kind === 'sent' ? { kind: 'idle' } : current));
      formRef.current?.reset();
    }, 400);
    return () => window.clearTimeout(reset);
  }, [open]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.currentTarget);
      // Honeypot: preenchido só por robô — descarta sem avisar o remetente.
      if (data.get('botcheck')) {
        setStatus({ kind: 'sent' });
        return;
      }

      const name = String(data.get('name') ?? '');
      const email = String(data.get('email') ?? '');
      const message = String(data.get('message') ?? '');

      if (!ACCESS_KEY) {
        const body = [`Nome: ${name}`, `E-mail: ${email}`, '', message].join(
          '\n',
        );
        window.location.href = `mailto:${CONTACT_INBOX}?subject=${encodeURIComponent(
          `Contato pelo portfólio — ${name}`,
        )}&body=${encodeURIComponent(body)}`;
        return;
      }

      setStatus({ kind: 'sending' });
      try {
        const response = await fetch(ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            access_key: ACCESS_KEY,
            subject: `Contato pelo portfólio — ${name}`,
            from_name: 'Portfólio John Amorim',
            name,
            email,
            message,
          }),
        });
        const result = (await response.json()) as {
          success?: boolean;
          message?: string;
        };

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Falha no envio.');
        }
        setStatus({ kind: 'sent' });
        formRef.current?.reset();
      } catch (error) {
        setStatus({
          kind: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'Não foi possível enviar a mensagem.',
        });
      }
    },
    [],
  );

  const sending = status.kind === 'sending';

  const fieldClass =
    'mt-2 w-full border-b border-ink/20 bg-transparent pb-2 text-[15px] outline-none transition-colors placeholder:text-stone-soft/60 focus:border-ink disabled:opacity-50';
  const labelClass = 'text-[10px] tracking-[0.28em] text-stone-soft';

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center p-4 transition-opacity duration-300 ${
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      inert={!open || undefined}
    >
      {/* Fundo — clicar fora fecha */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/45 backdrop-blur-[2px]"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${fieldId}-title`}
        className={`relative max-h-[90svh] w-full max-w-lg overflow-y-auto rounded-3xl bg-cream p-7 text-ink shadow-2xl transition-transform duration-300 md:p-9 ${
          open ? 'translate-y-0' : 'translate-y-3'
        }`}
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className={labelClass}>CONTATO</p>
            <h2
              id={`${fieldId}-title`}
              className="mt-3 text-2xl font-medium leading-snug md:text-3xl"
            >
              Vamos conversar sobre o seu projeto.
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar formulário de contato"
            className="-mr-1 -mt-1 shrink-0 p-2 text-[13px] leading-none text-ink/50 transition-colors hover:text-ink"
          >
            ✕
          </button>
        </div>

        {status.kind === 'sent' ? (
          <div className="py-10 text-center">
            <p className="text-lg font-medium">Mensagem enviada.</p>
            <p className="mt-3 text-[14px] leading-relaxed text-stone-soft">
              Obrigado pelo contato — respondo assim que possível.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-8 rounded-full border border-ink/25 px-6 py-2.5 text-[13px] transition-colors hover:border-ink hover:bg-ink hover:text-cream"
            >
              Fechar
            </button>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="mt-8">
            {/* Honeypot — invisível para gente, irresistível para robô */}
            <input
              type="checkbox"
              name="botcheck"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden
            />

            <div>
              <label className={labelClass} htmlFor={`${fieldId}-name`}>
                NOME
              </label>
              <input
                ref={firstFieldRef}
                id={`${fieldId}-name`}
                name="name"
                type="text"
                required
                maxLength={120}
                autoComplete="name"
                disabled={sending}
                placeholder="como devo te chamar"
                className={fieldClass}
              />
            </div>

            <div className="mt-7">
              <label className={labelClass} htmlFor={`${fieldId}-email`}>
                E-MAIL
              </label>
              <input
                id={`${fieldId}-email`}
                name="email"
                type="email"
                required
                maxLength={200}
                autoComplete="email"
                disabled={sending}
                placeholder="para onde eu respondo"
                className={fieldClass}
              />
            </div>

            <div className="mt-7">
              <label className={labelClass} htmlFor={`${fieldId}-message`}>
                MENSAGEM
              </label>
              <textarea
                id={`${fieldId}-message`}
                name="message"
                required
                rows={4}
                maxLength={2000}
                disabled={sending}
                placeholder="conte um pouco sobre a ideia"
                className={`${fieldClass} resize-none`}
              />
            </div>

            {status.kind === 'error' && (
              <p
                role="alert"
                className="mt-7 rounded-2xl bg-cream-soft p-4 text-[13px] leading-relaxed text-stone-soft"
              >
                {status.message} Se preferir, escreva para{' '}
                <a
                  href={`mailto:${CONTACT_INBOX}`}
                  className="text-ink underline underline-offset-4"
                >
                  {CONTACT_INBOX}
                </a>
                .
              </p>
            )}

            <div className="mt-9 flex items-center justify-between gap-4">
              <p className="text-[11px] leading-relaxed text-stone-soft">
                Respondo em até 2 dias úteis.
              </p>
              <button
                type="submit"
                disabled={sending}
                className="shrink-0 rounded-full bg-ink px-7 py-3 text-[13px] text-cream transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {sending ? 'Enviando…' : 'Enviar mensagem'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
