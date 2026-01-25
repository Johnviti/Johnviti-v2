import { ArrowUpRight, Atom, Linkedin, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden pt-section px-8 pb-16 bg-[radial-gradient(circle_at_50%_0%,#0f172a_0%,#020617_100%)]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_30%,rgba(56,189,248,0.1)_0%,transparent_70%)] pointer-events-none" />
      
      <motion.div
        className="flex items-center gap-2 px-4 py-2 bg-border-lighter border border-border-light rounded-full text-sm text-text-secondary mb-8 backdrop-blur-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span className="w-1.5 h-1.5 bg-success-main rounded-full shadow-success-glow" />
        Disponível para novos projetos
      </motion.div>

      <motion.h1
        className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.1] text-center text-text-primary mb-6 flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-4 flex-wrap justify-center">
          Desenvolvendo 
          <motion.div 
            className="w-[120px] h-[60px] bg-white rounded-[20px] inline-block mx-2 animate-float" 
          /> 
          Interfaces
        </div>
        <div className="flex items-center gap-4 flex-wrap justify-center">
          Sistemas 
          <motion.div className="w-[140px] h-[60px] border border-border-highlight rounded-[30px] flex items-center justify-center mx-2 text-[#61dafb] bg-white/3 animate-float-reverse">
            <Atom size={32} />
            <span className="ml-2 text-base font-medium">React</span>
          </motion.div> 
          Ideias em Código
        </div>
      </motion.h1>

      <motion.p
        className="text-lg text-text-secondary text-center max-w-[600px] mb-12 leading-relaxed"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Criando sistemas web, interfaces e experiências focadas em performance e crescimento.
      </motion.p>

      <Button 
        variant="outline" 
        size="lg"
        onClick={() => window.open('#contact', '_self')}
      >
        Agendar Reunião <ArrowUpRight size={18} />
      </Button>

      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-8 hidden lg:flex">
        <h2 className="[writing-mode:vertical-rl] rotate-180 text-4xl font-bold text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.1)] whitespace-nowrap tracking-widest font-sans">
          John Amorim
        </h2>
        <span className="[writing-mode:vertical-rl] rotate-180 text-text-secondary text-sm">Siga-me</span>
        <div className="flex flex-col gap-6 mt-4">
          <motion.a 
            href="#" 
            target="_blank" 
            className="text-text-secondary transition-all duration-200 hover:text-text-primary"
            whileHover={{ scale: 1.1 }}
          >
            <Linkedin size={20} />
          </motion.a>
          <motion.a 
            href="#" 
            target="_blank" 
            className="text-text-secondary transition-all duration-200 hover:text-text-primary"
            whileHover={{ scale: 1.1 }}
          >
            <Instagram size={20} />
          </motion.a>
        </div>
      </div>
    </section>
  );
};
