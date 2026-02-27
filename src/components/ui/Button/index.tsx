import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <motion.button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 cursor-pointer font-inherit',
        {
          'bg-white text-black border border-white hover:bg-gray-100': variant === 'primary',
          'bg-transparent text-text-primary border border-border-highlight hover:bg-border-light hover:border-white/40': variant === 'outline',
          'bg-transparent text-text-secondary border-none hover:text-text-primary': variant === 'ghost',
          'bg-white/5 text-white backdrop-blur-[80px] shadow-[inset_0_0_0_1.2px_rgba(255,255,255,0.2),inset_2px_2px_10px_rgba(255,255,255,0.8),inset_-1px_-1px_4px_rgba(255,255,255,0.1),0_20px_53px_rgba(0,0,0,0.3)] hover:bg-white/10 hover:shadow-[inset_0_0_0_1.2px_rgba(255,255,255,0.3),inset_2px_2px_15px_rgba(255,255,255,0.9),inset_-1px_-1px_6px_rgba(255,255,255,0.2),0_20px_60px_rgba(0,0,0,0.4)]': variant === 'glass',
          'px-4 py-2 text-sm': size === 'sm',
          'px-6 py-3 text-base': size === 'md',
          'px-8 py-4 text-lg': size === 'lg',
        },
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props as any}
    >
      {children}
    </motion.button>
  );
};
