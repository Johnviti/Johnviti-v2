import { useEffect, useRef } from 'react';
import OryzoNav from '@/components/oryzo/OryzoNav';
import HeroSection from '@/components/oryzo/HeroSection';
import AiSection from '@/components/oryzo/AiSection';
import FeaturesSection from '@/components/oryzo/FeaturesSection';
import EncryptionSection from '@/components/oryzo/EncryptionSection';
import GripSustainSection from '@/components/oryzo/GripSustainSection';
import ReviewsSection from '@/components/oryzo/ReviewsSection';
import ProductSection from '@/components/oryzo/ProductSection';
import PaperSection from '@/components/oryzo/PaperSection';
import OryzoFooter from '@/components/oryzo/OryzoFooter';
import { useReveal } from '@/components/oryzo/useReveal';

/**
 * Estudo de design inspirado na estrutura de oryzo.ai (projeto criativo da
 * Lusion): landing page satírica de um "porta-copos com IA" fictício, com
 * copy e marca próprias. Nada é real, nada está à venda.
 */
const OryzoPage = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  useEffect(() => {
    document.title = 'John Amorim';
  }, []);

  return (
    <div
      ref={rootRef}
      className="min-h-svh bg-oryzo-bg font-archivo text-oryzo-cream selection:bg-oryzo-orange selection:text-oryzo-bg"
    >
      <OryzoNav />
      <main>
        <HeroSection />
        <AiSection />
        <FeaturesSection />
        <EncryptionSection />
        <GripSustainSection />
        <ReviewsSection />
        <ProductSection />
        <PaperSection />
      </main>
      <OryzoFooter />
    </div>
  );
};

export default OryzoPage;
