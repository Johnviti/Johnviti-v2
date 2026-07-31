/**
 * Shaders GLSL da galeria imersiva.
 * Mantidos como template strings para funcionar sem loaders extras.
 */

/**
 * Vertex shader dos tiles: projeta a parede sobre uma superfície curva.
 * O deslocamento em Z é proporcional à distância² do centro da viewport,
 * gerando uma calota contínua — tiles nas bordas recuam e inclinam.
 */
export const tileVertexShader = /* glsl */ `
  uniform float uCurve;
  uniform float uHover;
  uniform float uHoverScale;

  varying vec2 vUv;

  void main() {
    vUv = uv;

    vec3 p = position;
    // Zoom sutil no hover, escalando ao redor do centro do tile.
    p.xy *= 1.0 + uHover * (uHoverScale - 1.0);

    vec4 world = modelMatrix * vec4(p, 1.0);

    // Curvatura contínua da parede; o hover reduz a influência local.
    float d2 = dot(world.xy, world.xy);
    world.z -= d2 * uCurve * (1.0 - uHover * 0.35);

    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

/**
 * Fragment shader dos tiles: object-fit cover + fade de carregamento + hover.
 */
export const tileFragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uLoaded;   // 0 → placeholder, 1 → textura visível
  uniform float uHover;
  uniform vec2 uCoverScale;
  uniform vec2 uCoverOffset;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv * uCoverScale + uCoverOffset;
    vec3 tex = texture2D(uMap, uv).rgb;

    // Placeholder claro enquanto a textura carrega (fundo branco).
    vec3 placeholder = vec3(0.94);
    vec3 color = mix(placeholder, tex, uLoaded);

    // Hover: leve ganho de contraste e luminosidade.
    float contrast = 1.0 + uHover * 0.06;
    color = (color - 0.5) * contrast + 0.5;
    color *= 1.0 + uHover * 0.05;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export const postVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/**
 * Pós-processamento aplicado ao framebuffer inteiro:
 *  - zoom dependente da velocidade (a cena é renderizada com margem extra,
 *    então uZoom >= uZoomBase nunca amostra fora do FBO);
 *  - distorção barril tipo CRT (bordas dos tiles se curvam de forma contínua);
 *  - aberração cromática radial + direcional pela velocidade;
 *  - halo espectral nas bordas, acionado pela velocidade do zoom;
 *  - motion blur direcional sutil;
 *  - vinheta, grain animado e fade de entrada.
 */
export const postFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uScene;
  uniform float uTime;
  uniform float uZoom;        // zoom total (base + movimento)
  uniform float uZoomEffect;  // 0..1 — pulso enquanto o zoom está em movimento
  uniform float uZoomDirection; // -1 = zoom out, 1 = zoom in
  uniform float uZoomCycleSpeed; // voltas completas do espectro por segundo
  uniform float uZoomHaloWidth;  // alcance do glow em pixels CSS
  uniform float uZoomRimWidth;   // espessura do filete neon em pixels CSS
  uniform float uDistortion;  // intensidade do barril
  uniform float uAberration;  // deslocamento RGB em UV
  uniform vec2  uVelocity;    // direção/magnitude do movimento (suavizada)
  uniform float uBlur;        // 0..1 — motion blur direcional
  uniform float uVignette;
  uniform float uGrain;
  uniform float uFade;        // 0..1 — fade de entrada
  uniform vec2  uResolution;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  // Conversão compacta para criar o espectro contínuo ao redor da viewport.
  vec3 hsv2rgb(vec3 c) {
    vec3 p = abs(fract(c.xxx + vec3(0.0, 0.6666667, 0.3333333)) * 6.0 - 3.0);
    return c.z * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), c.y);
  }

  vec2 barrel(vec2 uv, float k) {
    vec2 c = uv - 0.5;
    float r2 = dot(c, c);
    return 0.5 + c * (1.0 + k * r2);
  }

  vec3 sampleScene(vec2 uv) {
    return texture2D(uScene, clamp(uv, 0.001, 0.999)).rgb;
  }

  void main() {
    // Corrige proporção para que a curvatura seja circular, não elíptica.
    float aspect = uResolution.x / uResolution.y;

    // 1. Zoom (renderizamos a cena com margem — zoom só amostra para dentro).
    vec2 uv = 0.5 + (vUv - 0.5) / uZoom;

    // 2. Distorção barril contínua sobre o framebuffer.
    uv = barrel(uv, uDistortion);

    vec2 centered = (vUv - 0.5) * vec2(aspect, 1.0);
    float radial = dot(centered, centered);

    // 3. Aberração cromática: radial (bordas) + direcional (velocidade).
    // Quase imperceptível no centro, mais visível nas extremidades.
    vec2 radialDir = normalize(vUv - 0.5 + 1e-6);
    // O zoom separa os canais radialmente: no zoom out a direção se inverte.
    vec2 zoomCa = radialDir * uZoomDirection * uZoomEffect
                * (0.0015 + radial * 0.0045);
    vec2 caOffset = radialDir * uAberration * (0.15 + radial * 3.2)
                  + uVelocity * uAberration * 8.0
                  + zoomCa;

    vec3 color;
    color.r = sampleScene(uv + caOffset).r;
    color.g = sampleScene(uv).g;
    color.b = sampleScene(uv - caOffset).b;

    // 4. Motion blur direcional muito sutil (3 taps extras).
    if (uBlur > 0.001) {
      vec2 step = uVelocity * uBlur * 0.4;
      vec3 acc = color;
      acc += sampleScene(uv + step);
      acc += sampleScene(uv - step);
      acc += sampleScene(uv + step * 2.0);
      color = mix(color, acc * 0.25, clamp(uBlur, 0.0, 1.0) * 0.75);
    }

    // 5. Vinheta clara: as bordas se dissolvem em branco (fundo claro).
    float vig = smoothstep(0.35, 1.55, radial) * uVignette;
    color = mix(color, vec3(1.0), vig);

    // 6. Halo de lente inspirado na Oryzo: espectro angular, bloom macio para
    // dentro da tela e um filete mais luminoso no limite da viewport.
    vec2 edgePx2 = min(vUv * uResolution, (1.0 - vUv) * uResolution);
    float edgePx = min(edgePx2.x, edgePx2.y);
    float softHalo = exp(-edgePx / max(uZoomHaloWidth, 1.0));
    float hotRim = exp(-edgePx / max(uZoomRimWidth, 1.0));
    float angle = atan(centered.y, centered.x);
    float colorPhase = uTime * uZoomCycleSpeed;
    float hue = fract(0.65 - (angle / 3.14159265) * 0.65
                    + colorPhase
                    + (1.0 - uZoomDirection) * 0.0125);
    vec3 haloColor = hsv2rgb(vec3(hue, 0.92, 1.0));
    float corner = smoothstep(0.18, 0.62, abs(centered.x * centered.y));
    float shimmer = 0.93 + 0.07 * sin(angle * 7.0 - uTime * 5.0);
    float haloMask = clamp(
      (softHalo * (0.8 + corner * 0.24) + hotRim * 0.62)
        * uZoomEffect * shimmer,
      0.0,
      1.0
    );
    vec3 screened = 1.0 - (1.0 - color) * (1.0 - haloColor * 0.92);
    color = mix(color, screened, haloMask * 0.78);
    // O segundo mix cria a linha neon saturada e a mantém visível sobre gaps claros.
    float neonCore = clamp(
      haloMask * 0.22 + hotRim * uZoomEffect * 0.38,
      0.0,
      0.68
    );
    color = mix(color, haloColor, neonCore);

    // 7. Leve ganho de contraste.
    color = (color - 0.5) * 1.06 + 0.5;
    color = clamp(color, 0.0, 1.0);

    // 8. Grain animado, fixo na viewport.
    float grain = hash(vUv * uResolution * 0.75 + fract(uTime) * 917.0);
    color += (grain - 0.5) * uGrain;

    // 9. Fade de entrada a partir do branco.
    gl_FragColor = vec4(mix(vec3(1.0), color, uFade), 1.0);
  }
`;
