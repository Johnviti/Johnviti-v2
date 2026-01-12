import styled from 'styled-components';
import { motion } from 'framer-motion';

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}

const ItemContainer = styled(motion.a)<{ $active?: boolean }>`
  color: ${({ $active, theme }) => ($active ? theme.colors.text.primary : theme.colors.text.secondary)};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  cursor: pointer;
  position: relative;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
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
