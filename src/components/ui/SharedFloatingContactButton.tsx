import { ContactLink } from '@/components/loader/ContactTransition';
import ButtonWithAnimatedArrow from '@/components/ui/ButtonWithAnimatedArrow';
import IconTooltip from '@/components/ui/IconTooltip';
import { useI18n } from '@/lib/i18n';

/** CTA persistente entre a galeria e os cases, sem remontar na troca de rota. */
export default function SharedFloatingContactButton() {
  const { t } = useI18n();

  return (
    <IconTooltip
      label={t('case.ctaAction')}
      side="top"
      className="gallery-case-shared-cta fixed bottom-4 left-4 z-40 max-w-[calc(100vw-5.5rem)] md:bottom-6 md:left-6 md:max-w-none"
    >
      <ContactLink>
        <ButtonWithAnimatedArrow asChild variant="secondary" size="compact">
          {t('case.floating')}
        </ButtonWithAnimatedArrow>
      </ContactLink>
    </IconTooltip>
  );
}
