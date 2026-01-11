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
  padding: 8rem 2rem 4rem;
  background: radial-gradient(circle at 50% 0%, #0f172a 0%, #020617 100%);
`;

export const BackgroundGradient = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 30%, rgba(56, 189, 248, 0.1) 0%, transparent 70%);
  pointer-events: none;
`;

export const Badge = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  font-size: 0.875rem;
  color: #94a3b8;
  margin-bottom: 2rem;
  backdrop-filter: blur(8px);
`;

export const StatusDot = styled.span`
  width: 6px;
  height: 6px;
  background-color: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 8px #22c55e;
`;

export const MainText = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 700;
  line-height: 1.1;
  text-align: center;
  color: white;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export const TextRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

export const WhiteBox = styled(motion.div)`
  width: 120px;
  height: 60px;
  background: white;
  border-radius: 20px;
  display: inline-block;
  margin: 0 0.5rem;
  animation: ${float} 6s ease-in-out infinite;
`;

export const ReactBox = styled(motion.div)`
  width: 140px;
  height: 60px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0.5rem;
  color: #61dafb;
  background: rgba(255, 255, 255, 0.03);
  animation: ${float} 6s ease-in-out infinite reverse;
`;

export const Subtitle = styled(motion.p)`
  font-size: 1.125rem;
  color: #94a3b8;
  text-align: center;
  max-width: 600px;
  margin-bottom: 3rem;
  line-height: 1.6;
`;

export const SideBar = styled.div`
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const VerticalText = styled.h2`
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  font-size: 4rem;
  font-weight: 700;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1);
  white-space: nowrap;
  letter-spacing: 0.1em;
  font-family: 'Inter', sans-serif;
`;

export const SocialLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
`;

export const SocialLink = styled(motion.a)`
  color: #94a3b8;
  transition: color 0.2s;
  
  &:hover {
    color: white;
  }
`;
