/**
 * Parâmetros centrais da galeria imersiva.
 * Ajuste estes valores para calibrar a experiência com o vídeo de referência.
 */
export const galleryConfig = {
  /** Colunas visíveis por breakpoint (controla o "zoom" base da parede). */
  columnsDesktop: 4.3,
  columnsTablet: 3.1,
  columnsMobile: 2.5,

  /** Célula virtual do grid, em unidades de mundo (1 célula ≈ 1 coluna).
   *  cellHeight menor porque as capas são todas landscape (tiles mais baixos),
   *  o que reduz o respiro vertical entre as fileiras. */
  cellWidth: 1.0,
  cellHeight: 0.68,
  /** Largura do tile dentro da célula — o restante vira o gap branco.
   *  Mais próxima de cellWidth = menos espaçamento horizontal. */
  tileWidth: 0.9,

  /** Curvatura da parede (deslocamento Z por distância² ao centro). */
  baseCurvature: 0.02,
  maximumCurvature: 0.14,

  /** Distorção barril do pós-processamento (efeito CRT / olho de peixe). */
  baseDistortion: 0.018,
  maximumDistortion: 0.3,

  /** Zoom-in aplicado durante o movimento (1 = sem zoom). */
  motionZoom: 0.16,

  /** Física do arraste. */
  dragSensitivity: 1.0,
  wheelSensitivity: 0.8,
  friction: 0.93,
  interpolation: 0.09,
  /** Velocidade (unid. mundo/frame) que corresponde a "efeito máximo". */
  speedForMaxEffect: 0.085,

  /** Aberração cromática, em coordenadas UV. */
  minimumChromaticAberration: 0.0006,
  maximumChromaticAberration: 0.004,

  /** Acabamento. */
  vignetteStrength: 0.32,
  grainStrength: 0.045,
  motionBlurStrength: 0.2,

  /** Interações. */
  hoverScale: 1.025,
  hoverEase: 0.08,
  /** Deslocamento máximo (px) para um toque contar como clique no tile. */
  clickMaxDistance: 8,

  /** Cursor personalizado — anel em mix-blend-difference (branco adaptativo). */
  cursorSize: 26,
  cursorHoverSize: 72,
  cursorDragSize: 44,
  cursorColor: '#ffffff',

  /** Performance. */
  maxPixelRatioDesktop: 2,
  maxPixelRatioMobile: 1.5,
  textureConcurrency: 5,
} as const;

export type GalleryConfig = typeof galleryConfig;
