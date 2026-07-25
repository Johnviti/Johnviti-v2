/**
 * Textura de grão (film grain) no papel da página — como o fundo de
 * funtownstudio.com/contact. Ruído SVG (feTurbulence) que "treme" em passos,
 * dando a sensação de granulado analógico.
 *
 * É puramente decorativo (`aria-hidden`), não captura ponteiro e fica atrás do
 * conteúdo (imagens, texto, header). O wrapper da página precisa de `isolate`
 * para o z-index negativo do overlay não sumir atrás do fundo. Animação e
 * blend vivem em `.grain-overlay` no index.css.
 */
export default function GrainOverlay() {
  return <div className="grain-overlay" aria-hidden />;
}
