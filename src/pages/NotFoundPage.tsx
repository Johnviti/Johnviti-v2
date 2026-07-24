import Logo from '@/components/Logo';
import { RouteTransitionLink } from '@/components/loader/ContactTransition';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { useI18n } from '@/lib/i18n';

/**
 * Página 404 — servida para rotas desconhecidas. Simples e na identidade do
 * site (papel cream/tinta, monograma JA), com caminho de volta à galeria.
 * O prerender também emite um `404.html` estático para o host devolver com
 * status 404 real a quem chega direto por uma URL inválida.
 */
export default function NotFoundPage() {
  const { t } = useI18n();

  useDocumentMeta({
    title: 'John Amorim — 404',
    description: t('nf.body'),
    path: '/404',
  });

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 bg-surface px-6 text-center text-ink">
      <Logo className="h-8 w-auto opacity-80" />
      <p className="text-[clamp(4rem,18vw,9rem)] font-medium leading-none tracking-tight">
        404
      </p>
      <div className="max-w-[42ch] space-y-3">
        <h1 className="text-[clamp(1.3rem,3vw,1.9rem)] font-medium tracking-tight">
          {t('nf.title')}
        </h1>
        <p className="text-[15px] leading-relaxed text-stone-soft md:text-[16px]">
          {t('nf.body')}
        </p>
      </div>
      <RouteTransitionLink
        href="/"
        className="rounded-full bg-ink px-7 py-3.5 text-[15px] font-medium text-cream transition-opacity hover:opacity-85"
      >
        ← {t('nav.backToGallery')}
      </RouteTransitionLink>
    </main>
  );
}
