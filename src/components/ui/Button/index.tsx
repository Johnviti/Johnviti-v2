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
  gap: 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  font-family: inherit;
  
  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return css`
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        `;
      case 'lg':
        return css`
          padding: 1rem 2rem;
          font-size: 1.125rem;
        `;
      default: // md
        return css`
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
        `;
    }
  }}

  ${({ $variant }) => {
    switch ($variant) {
      case 'primary':
        return css`
          background-color: white;
          color: black;
          border: 1px solid white;
          &:hover {
            background-color: #f3f4f6;
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          &:hover {
            background-color: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.4);
          }
        `;
      case 'ghost':
        return css`
          background-color: transparent;
          color: #9ca3af;
          border: none;
          &:hover {
            color: white;
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
