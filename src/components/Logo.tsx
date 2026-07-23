/**
 * Marca do John Amorim — monograma em blocos (grade 80px).
 * A cor vem de `currentColor`, então basta definir a cor do texto do
 * container (ex.: `text-ink` para preto, `text-white` para branco).
 */
type LogoProps = {
  className?: string;
  title?: string;
};

const Logo = ({ className, title = 'John Amorim' }: LogoProps) => (
  <svg
    viewBox="0 0 400 320"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label={title}
  >
    <rect x="320" y="80" width="80" height="80" />
    <path d="M320 80H400L320 0V80Z" />
    <rect x="240" width="80" height="80" />
    <rect x="80" y="240" width="80" height="80" />
    <path d="M160 240H240V320H160V240Z" />
    <path d="M320 240H400L320 320V240Z" />
    <rect y="160" width="80" height="80" />
    <rect x="160" y="80" width="80" height="80" />
    <rect x="160" width="80" height="80" />
    <rect x="80" width="80" height="80" />
    <rect x="160" y="160" width="80" height="80" />
    <rect x="320" y="160" width="80" height="80" />
    <path d="M240 160H320L240 240V160Z" />
    <path d="M80 240H0L80 320V240Z" />
  </svg>
);

export default Logo;
