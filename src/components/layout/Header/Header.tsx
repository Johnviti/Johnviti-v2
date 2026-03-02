import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { HeaderProps } from "./Header.types";
import LogoIcon from "@/assets/logo-john-amorim.svg";

export const Header = ({}: HeaderProps) => {
  const { scrollY } = useScroll();

  // progresso do efeito (0 → 300px)
  const progress = useTransform(scrollY, [0, 300], [0, 1], { clamp: true });

  // ↓↓↓ diminui mais quando rolar
  const scale = useTransform(progress, [0, 1], [1, 0.84]);
  const maxWidth = useTransform(progress, [0, 1], [1920, 300]);

  // PREMIUM: desliza levemente pra esquerda ao encolher
  const x = useTransform(progress, [0, 1], [0, -48]);

  // padding da pílula (menor no scroll)
  const paddingY = useTransform(progress, [0, 1], [20, 12]);

  // fundo entra só no scroll
  const backgroundColor = useTransform(
    progress,
    [0, 0.2, 1],
    [
      "hsla(var(--dark-hsl) / 0)", // transparente
      "hsla(var(--dark-hsl) / 0.12)", // começa
      "hsla(var(--dark-hsl) / 0.3)", // final
    ]
  );

  // blur começa em 0 e aumenta
  const backdropFilter = useTransform(
    progress,
    [0, 1],
    ["blur(0px)", "blur(12px)"]
  );

  // sombra suave
  const boxShadow = useTransform(
    progress,
    [0, 1],
    [
      "0px 0px 0px 0px hsla(var(--brand-primary-hsl) / 0)",
      "0px 0px 80px -38px hsla(var(--brand-primary-hsl) / 0.6)",
    ]
  );

  const [isScrolled, setIsScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => {
    setIsScrolled(v > 50);
  });

  return (
    <motion.header className="fixed top-0 left-0 right-0 z-50 w-full pt-6 pb-4 lg:px-[90px]">
      <motion.div
        // IMPORTANT: tira o mx-auto pra não centralizar
        className="mx-auto flex w-full items-center justify-between rounded-full px-5"
        style={{
          maxWidth,
          scale,
          x, // PREMIUM: deslocamento suave
          paddingTop: paddingY,
          paddingBottom: paddingY,
          backgroundColor,
          backdropFilter,
          boxShadow,
          transformOrigin: "left center", // PREMIUM: ancora o scale à esquerda
        }}
      >
        {/* LOGO (reduz um pouco mais no scroll) */}
        <motion.div
          className="origin-left"
          animate={{ scale: isScrolled ? 0.88 : 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <img src={LogoIcon} alt="John Amorim" className="h-8 w-auto" />
        </motion.div>

        {/* AÇÃO À DIREITA */}
        <div className="flex items-center gap-4">
          {/* TEXTO some no scroll (com animação) */}
          <motion.p
            className="text-white text-sm 2xl:text-base whitespace-nowrap"
            animate={{
              opacity: isScrolled ? 0 : 1,
              width: isScrolled ? 0 : "auto",
              marginRight: 0,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ overflow: "hidden" }}
          >
            Precisando de um desenvolvedor?
          </motion.p>

          {/* botão SEMPRE glass */}
          <motion.div
            animate={{ scale: isScrolled ? 0.92 : 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Button variant="glass" size="sm">
              Contrate-me <ArrowUpRight size={16} />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.header>
  );
};