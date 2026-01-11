import { ArrowUpRight } from 'lucide-react';
import { useScrollPosition } from '../../../hooks/useScrollPosition';
import { Logo } from '../../ui/Logo';
import { NavItem } from '../../ui/NavItem';
import { Button } from '../../ui/Button';
import { HeaderContainer, Nav, Actions } from './Header.styles';
import { HeaderProps } from './Header.types';

export const Header = ({}: HeaderProps) => {
  const scrollPosition = useScrollPosition();
  const isScrolled = scrollPosition > 50;

  return (
    <HeaderContainer 
      $scrolled={isScrolled}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Logo />
      
      <Nav>
        <NavItem href="#home" active>Home</NavItem>
        <NavItem href="#about">Sobre</NavItem>
        <NavItem href="#projects">Projetos</NavItem>
      </Nav>

      <Actions>
        <Button variant="outline" size="sm">
          Contrate-me <ArrowUpRight size={16} />
        </Button>
      </Actions>
    </HeaderContainer>
  );
};
