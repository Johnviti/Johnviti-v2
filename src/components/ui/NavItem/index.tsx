import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}

export const NavItem = ({ href, children, active }: NavItemProps) => {
  return (
    <motion.a 
      href={href} 
      className={cn(
        'no-underline text-base font-medium cursor-pointer relative transition-all duration-200',
        active ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.a>
  );
};
