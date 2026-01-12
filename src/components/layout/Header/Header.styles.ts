import styled from 'styled-components';
import { motion } from 'framer-motion';

export const HeaderContainer = styled(motion.header)<{ $scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndices.header};
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.xl}`};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ $scrolled, theme }) => ($scrolled ? 'rgba(3, 7, 18, 0.8)' : theme.colors.transparent)};
  backdrop-filter: ${({ $scrolled }) => ($scrolled ? 'blur(12px)' : 'none')};
  transition: ${({ theme }) => theme.transitions.slow};
  border-bottom: ${({ $scrolled, theme }) => ($scrolled ? `1px solid ${theme.colors.border.lighter}` : 'none')};
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    display: none;
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;
