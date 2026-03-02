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
import { clsx } from "clsx";
import LogoIcon from "@/assets/logo-john-amorim.svg";

export const Header = ({}: HeaderProps) => {
  const { scrollY } = useScroll();

  // progresso do efeito (0 → 300px)
  const progress = useTransform(scrollY, [0, 300], [0, 1], {
    clamp: true,
  });

  // animações principais
  const scale = useTransform(progress, [0, 1], [1, 0.9]);
  const maxWidth = useTransform(progress, [0, 1], [1920, 600]);

  // padding da pílula
  const paddingY = useTransform(progress, [0, 1], [20, 16]);

  // fundo entra só no scroll
  const backgroundColor = useTransform(
    progress,
    [0, 0.2, 1],
    [
      "hsla(var(--dark-hsl) / 0)",      // totalmente transparente
      "hsla(var(--dark-hsl) / 0.35)",   // começa a aparecer
      "hsla(var(--dark-hsl) / 0.6)",    // fundo final
    ]
  );

  // blur começa em 0 e aumenta
  const backdropFilter = useTransform(
    progress,
    [0, 1],
    ["blur(0px)", "blur(10px)"]
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

  // apenas para micro ajustes internos (logo/texto)
  const [isScrolled, setIsScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => {
    setIsScrolled(v > 50);
  });

  return (
    <motion.header className="fixed top-0 left-0 right-0 z-50 w-full pt-6 pb-4 lg:px-[90px]">
      {/* inside-header */}
      <motion.div
        className="mx-auto flex w-full items-center justify-between rounded-full px-5"
        style={{
          maxWidth,
          scale,
          paddingTop: paddingY,
          paddingBottom: paddingY,
          backgroundColor,
          backdropFilter,
          boxShadow,
        }}
      >
        <div
          className={clsx(
            "transition-transform duration-300",
            isScrolled && "scale-90"
          )}
        >
          <img src={LogoIcon} alt="John Amorim" className="h-8 w-auto" />
        </div>

        <div
          className={clsx(
            "flex items-center gap-4 transition-transform duration-300",
            isScrolled && "scale-90"
          )}
        >
          <p className="text-white text-sm 2xl:text-base">
            Precisando de um desenvolvedor?
          </p>

          {/* botão SEMPRE glass */}
          <Button variant="glass" size="sm">
            Contrate-me <ArrowUpRight size={16} />
          </Button>
        </div>
      </motion.div>
    </motion.header>
  );
};