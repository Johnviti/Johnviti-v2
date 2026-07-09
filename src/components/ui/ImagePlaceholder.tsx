import { useI18n } from '../../i18n/context';
import { cn } from '../../lib/utils';

interface ImagePlaceholderProps {
  label?: string;
  className?: string;
}

// Bloco cinza no lugar das imagens até o material real dos projetos chegar.
export function ImagePlaceholder({ label, className }: ImagePlaceholderProps) {
  const { t } = useI18n();

  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden bg-block',
        className,
      )}
    >
      <span aria-hidden className="absolute top-4 left-4 text-line">
        +
      </span>
      <span aria-hidden className="absolute right-4 bottom-4 text-line">
        +
      </span>
      <span className="tech-label text-muted">{label ?? t('common.placeholder')}</span>
    </div>
  );
}
