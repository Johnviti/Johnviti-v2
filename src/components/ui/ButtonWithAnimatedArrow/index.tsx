import { ArrowUpRight } from 'lucide-react';

interface ButtonWithAnimatedArrowProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'compact';
  /** Renderiza somente a camada visual quando o componente vive dentro de um link. */
  asChild?: boolean;
}

export const ButtonWithAnimatedArrow = ({
  children,
  variant = 'primary',
  size = 'default',
  asChild = false,
  className,
  ...props
}: ButtonWithAnimatedArrowProps) => {
  const variants = {
    primary: {
      button: 'bg-ink text-cream hover:bg-charcoal',
      icon: 'bg-cream text-ink group-hover:bg-cream-soft',
    },
    secondary: {
      button: 'bg-ink text-cream hover:bg-charcoal',
      icon: 'bg-cream text-ink group-hover:bg-cream-soft',
    },
  };
  const sizes = {
    default: {
      button: 'h-12 ps-6 pe-14 hover:ps-14 hover:pe-6',
      icon: 'size-10 group-hover:right-[calc(100%-44px)]',
    },
    compact: {
      button: 'h-10 ps-4 pe-11 text-xs hover:ps-11 hover:pe-4',
      icon: 'size-8 group-hover:right-[calc(100%-36px)]',
    },
  };

  const buttonClassName = `group relative inline-flex w-fit cursor-pointer items-center overflow-hidden rounded-full p-1 text-sm font-medium shadow-lg transition-all duration-500 ${sizes[size].button} ${variants[variant].button} ${className ?? ''}`;
  const content = (
    <>
      <span className="relative z-10 transition-all duration-500 inline-block">
        {children}
      </span>
      <span
        aria-hidden
        className={`absolute right-1 top-1 flex items-center justify-center rounded-full transition-all duration-500 group-hover:rotate-45 ${sizes[size].icon} ${variants[variant].icon}`}
      >
        <ArrowUpRight size={16} />
      </span>
    </>
  );

  if (asChild) return <span className={buttonClassName}>{content}</span>;

  return (
    <button type="button" className={buttonClassName} {...props}>
      {content}
    </button>
  );
};

export default ButtonWithAnimatedArrow;
