/**
 * Textura de grão (film grain) sobre a página inteira — como o fundo de
 * funtownstudio.com/contact. Ruído SVG (feTurbulence) que "treme" em passos,
 * dando a sensação de granulado analógico.
 *
 * É puramente decorativo (`aria-hidden`), não captura ponteiro e fica atrás da
 * interface fixa (header/menu). A animação e a mistura de cores vivem em
 * `.grain-overlay` no index.css, que respeita `prefers-reduced-motion` e troca
 * o blend entre os temas claro e escuro.
 */
export default function GrainOverlay() {
  return <div className="grain-overlay" aria-hidden />;
}
