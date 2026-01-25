import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
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
