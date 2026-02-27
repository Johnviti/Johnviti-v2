import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { Button } from '@/components/ui/Button';
import type { HeaderProps } from './Header.types';
import { clsx } from 'clsx';
import LogoIcon from '@/assets/logo-john-amorim.svg';

export const Header = ({ }: HeaderProps) => {
  const scrollPosition = useScrollPosition();
  const isScrolled = scrollPosition > 50;

  return (
    <motion.header className="w-full z-50 pt-6 pb-4">
      <div className="flex items-center justify-between w-full">
        <div className={clsx("transition-all duration-300", isScrolled && "scale-90")}>
          <img src={LogoIcon} alt="John Amorim" className="h-8 w-auto" />
        </div>

        <div className={clsx("flex items-center gap-4", isScrolled && "scale-90")}>
          <Button variant={isScrolled ? "primary" : "glass"} size="sm">
            Contrate-me <ArrowUpRight size={16} />
          </Button>
        </div>
      </div>
    </motion.header>
  );
};
