import { ArrowUpRight, Atom, Linkedin, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTheme } from 'styled-components';
import {
  HeroSection,
  BackgroundGradient,
  Badge,
  StatusDot,
  MainText,
  TextRow,
  WhiteBox,
  ReactBox,
  Subtitle,
  SideBar,
  VerticalText,
  SocialLinks,
  SocialLink
} from './Hero.styles';

export const Hero = () => {
  const theme = useTheme();

  return (
    <HeroSection>
      <BackgroundGradient />
      
      <Badge
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <StatusDot />
        Disponível para novos projetos
      </Badge>

      <MainText
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <TextRow>
          Desenvolvendo <WhiteBox /> Interfaces
        </TextRow>
        <TextRow>
          Sistemas 
          <ReactBox>
            <Atom size={32} />
            <span style={{ marginLeft: theme.spacing.sm, fontSize: theme.typography.sizes.base, fontWeight: theme.typography.weights.medium }}>React</span>
          </ReactBox> 
          Ideias em Código
        </TextRow>
      </MainText>

      <Subtitle
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Criando sistemas web, interfaces e experiências focadas em performance e crescimento.
      </Subtitle>

      <Button 
        variant="outline" 
        size="lg"
        onClick={() => window.open('#contact', '_self')}
      >
        Agendar Reunião <ArrowUpRight size={18} />
      </Button>

      <SideBar>
        <VerticalText>John Amorim</VerticalText>
        <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', color: theme.colors.text.secondary, fontSize: theme.typography.sizes.sm }}>Siga-me</span>
        <SocialLinks>
          <SocialLink href="#" target="_blank" whileHover={{ scale: 1.1 }}>
            <Linkedin size={20} />
          </SocialLink>
          <SocialLink href="#" target="_blank" whileHover={{ scale: 1.1 }}>
            <Instagram size={20} />
          </SocialLink>
        </SocialLinks>
      </SideBar>
    </HeroSection>
  );
};
