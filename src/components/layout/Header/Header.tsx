import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { Logo } from '@/components/ui/Logo';
import { NavItem } from '@/components/ui/NavItem';
import { Button } from '@/components/ui/Button';
import type { HeaderProps } from './Header.types';
import { clsx } from 'clsx';

export const Header = ({}: HeaderProps) => {
  const scrollPosition = useScrollPosition();
  const isScrolled = scrollPosition > 50;

  return (
    <motion.header 
      className={clsx(
        'fixed z-header transition-all duration-300 flex items-center',
        isScrolled 
          ? 'top-4 left-1/2 -translate-x-1/2 rounded-full bg-background/80 backdrop-blur-md border border-border-lighter py-3 px-6 gap-8 w-auto justify-center shadow-lg' 
          : 'top-0 left-0 right-0 w-full justify-between px-8 py-6 bg-transparent border-b border-transparent'
      )}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={clsx("transition-all duration-300", isScrolled && "scale-90")}>
        <Logo />
      </div>
      
      <nav className={clsx(
        "hidden md:flex items-center",
        isScrolled ? "gap-6" : "gap-8"
      )}>
        <NavItem href="#home" active>Home</NavItem>
        <NavItem href="#about">Sobre</NavItem>
        <NavItem href="#projects">Projetos</NavItem>
      </nav>

      <div className={clsx("flex items-center gap-4", isScrolled && "scale-90")}>
        <Button variant={isScrolled ? "primary" : "outline"} size="sm">
          Contrate-me <ArrowUpRight size={16} />
        </Button>
      </div>
    </motion.header>
  );
};
