import styled from 'styled-components';
import { motion } from 'framer-motion';

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}

const ItemContainer = styled(motion.a)<{ $active?: boolean }>`
  color: ${({ $active }) => ($active ? 'white' : '#9ca3af')};
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;

  &:hover {
    color: white;
  }
`;

export const NavItem = ({ href, children, active }: NavItemProps) => {
  return (
    <ItemContainer 
      href={href} 
      $active={active}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </ItemContainer>
  );
};
