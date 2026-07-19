/**
 * Parâmetros centrais da galeria imersiva.
 * Ajuste estes valores para calibrar a experiência com o vídeo de referência.
 */
export const galleryConfig = {
  /** Texto do logotipo no canto superior esquerdo (facilmente substituível). */
  brandText: 'JOHN AMORIM®',
  menuText: 'MENU',
  exitText: 'EXIT',

  /** Colunas visíveis por breakpoint (controla o "zoom" base da parede). */
  columnsDesktop: 4.3,
  columnsTablet: 3.1,
  columnsMobile: 2.5,

  /** Célula virtual do grid, em unidades de mundo (1 célula ≈ 1 coluna). */
  cellWidth: 1.0,
  cellHeight: 1.06,
  /** Largura do tile dentro da célula — o restante vira o gap branco. */
  tileWidth: 0.865,

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

  /** Cursor personalizado. */
  cursorSize: 30,
  cursorHoverSize: 46,
  cursorDragSize: 22,
  cursorColor: 'rgba(196, 32, 32, 0.85)',

  /** Performance. */
  maxPixelRatioDesktop: 2,
  maxPixelRatioMobile: 1.5,
  textureConcurrency: 5,
} as const;

export type GalleryConfig = typeof galleryConfig;
