import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

export const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: ${({ theme }) => `${theme.spacing.section} ${theme.spacing.xl} ${theme.spacing['3xl']}`};
  background: radial-gradient(circle at 50% 0%, #0f172a 0%, ${({ theme }) => theme.colors.background} 100%);
`;

export const BackgroundGradient = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 30%, ${({ theme }) => theme.colors.primary.light} 0%, transparent 70%);
  pointer-events: none;
`;

export const Badge = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background: ${({ theme }) => theme.colors.border.lighter};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  backdrop-filter: blur(8px);
`;

export const StatusDot = styled.span`
  width: 6px;
  height: 6px;
  background-color: ${({ theme }) => theme.colors.success.main};
  border-radius: 50%;
  box-shadow: ${({ theme }) => theme.colors.success.glow};
`;

export const MainText = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  line-height: 1.1;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const TextRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
`;

export const WhiteBox = styled(motion.div)`
  width: 120px;
  height: 60px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 20px;
  display: inline-block;
  margin: 0 ${({ theme }) => theme.spacing.sm};
  animation: ${float} 6s ease-in-out infinite;
`;

export const ReactBox = styled(motion.div)`
  width: 140px;
  height: 60px;
  border: 1px solid ${({ theme }) => theme.colors.border.highlight};
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 ${({ theme }) => theme.spacing.sm};
  color: #61dafb;
  background: rgba(255, 255, 255, 0.03);
  animation: ${float} 6s ease-in-out infinite reverse;
`;

export const Subtitle = styled(motion.p)`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  max-width: 600px;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  line-height: 1.6;
`;

export const SideBar = styled.div`
  position: absolute;
  right: ${({ theme }) => theme.spacing.xl};
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const VerticalText = styled.h2`
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  font-size: ${({ theme }) => theme.typography.sizes['4xl']};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.transparent};
  -webkit-text-stroke: 1px ${({ theme }) => theme.colors.border.light};
  white-space: nowrap;
  letter-spacing: 0.1em;
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
`;

export const SocialLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export const SocialLink = styled(motion.a)`
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;
