import { useI18n } from '@/lib/i18n';

/**
 * Link "pular para o conteúdo" — primeiro elemento focável da página.
 *
 * Fica fora da tela (ver `.skip-link` em index.css) até receber foco pelo
 * teclado; então desliza para o topo. Ao ser ativado, move o foco para o
 * elemento com `id={targetId}` (que deve ter `tabIndex={-1}`).
 */
export default function SkipLink({
  targetId = 'conteudo',
}: {
  targetId?: string;
}) {
  const { t } = useI18n();
  return (
    <a href={`#${targetId}`} className="skip-link">
      {t('nav.skip')}
    </a>
  );
}
