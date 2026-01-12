import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

interface ButtonProps {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const ButtonContainer = styled(motion.button)<{ $variant: string; $size: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  transition: ${({ theme }) => theme.transitions.default};
  cursor: pointer;
  font-family: inherit;
  
  ${({ $size, theme }) => {
    switch ($size) {
      case 'sm':
        return css`
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: ${theme.typography.sizes.sm};
        `;
      case 'lg':
        return css`
          padding: ${theme.spacing.md} ${theme.spacing.xl};
          font-size: ${theme.typography.sizes.lg};
        `;
      default: // md
        return css`
          padding: 0.75rem ${theme.spacing.lg};
          font-size: ${theme.typography.sizes.base};
        `;
    }
  }}

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return css`
          background-color: ${theme.colors.white};
          color: ${theme.colors.black};
          border: 1px solid ${theme.colors.white};
          &:hover {
            background-color: #f3f4f6; // Keep this or add to theme
          }
        `;
      case 'outline':
        return css`
          background-color: ${theme.colors.transparent};
          color: ${theme.colors.text.primary};
          border: 1px solid ${theme.colors.border.highlight};
          &:hover {
            background-color: ${theme.colors.border.light};
            border-color: rgba(255, 255, 255, 0.4);
          }
        `;
      case 'ghost':
        return css`
          background-color: ${theme.colors.transparent};
          color: ${theme.colors.text.secondary};
          border: none;
          &:hover {
            color: ${theme.colors.text.primary};
          }
        `;
      default:
        return css``;
    }
  }}
`;

export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  onClick,
  className 
}: ButtonProps) => {
  return (
    <ButtonContainer
      $variant={variant}
      $size={size}
      onClick={onClick}
      className={className}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </ButtonContainer>
  );
};
