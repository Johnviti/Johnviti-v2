import styled from 'styled-components';
import { motion } from 'framer-motion';

export const HeaderContainer = styled(motion.header)<{ $scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ $scrolled }) => ($scrolled ? 'rgba(3, 7, 18, 0.8)' : 'transparent')};
  backdrop-filter: ${({ $scrolled }) => ($scrolled ? 'blur(12px)' : 'none')};
  transition: all 0.3s ease;
  border-bottom: ${({ $scrolled }) => ($scrolled ? '1px solid rgba(255, 255, 255, 0.05)' : 'none')};
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
