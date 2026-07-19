import * as THREE from 'three';
import type { GalleryConfig } from '../galleryConfig';
import { GRID_COLS, GRID_ROWS, type GalleryItem } from '../galleryItems';
import {
  postFragmentShader,
  postVertexShader,
  tileFragmentShader,
  tileVertexShader,
} from './shaders';

type Vec2 = { x: number; y: number };

export type GalleryAppOptions = {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  items: GalleryItem[];
  config: GalleryConfig;
  reducedMotion: boolean;
  /** Disparado na primeira interação do usuário (cancela a introdução). */
  onUserInteract?: () => void;
  /** Disparado quando um tile é clicado (tap sem arraste). */
  onItemClick?: (item: GalleryItem, index: number) => void;
};

type Tile = {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  baseX: number;
  baseY: number;
  hover: number;
  loaded: number;
  loadedTarget: number;
};

/**
 * A cena é renderizada com esta margem extra e o pós-processamento aplica o
 * zoom base equivalente — assim a distorção barril nunca amostra fora do FBO.
 */
const OVERSCAN = 1.09;
const FOV = 50;

export class GalleryApp {
  /** Posição-alvo da parede, em unidades de mundo. Tweenável pela introdução. */
  readonly target: Vec2 = { x: 0, y: 0 };

  /** Estado público lido pelo cursor personalizado a cada frame. */
  readonly state = { speed: 0, vx: 0, vy: 0, dragging: false, hovering: false };

  private readonly opts: GalleryAppOptions;
  private readonly cfg: GalleryConfig;

  private renderer!: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera!: THREE.PerspectiveCamera;
  private renderTarget!: THREE.WebGLRenderTarget;
  private postScene = new THREE.Scene();
  private postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private postMaterial!: THREE.ShaderMaterial;
  private tiles: Tile[] = [];
  private tileGeometry = new THREE.PlaneGeometry(1, 1);
  private raycaster = new THREE.Raycaster();

  private current: Vec2 = { x: 0, y: 0 };
  private previous: Vec2 = { x: 0, y: 0 };
  private velocity: Vec2 = { x: 0, y: 0 };
  private pendingDrag: Vec2 = { x: 0, y: 0 };
  private speedSmooth = 0;
  private velSmooth: Vec2 = { x: 0, y: 0 };
  private fade = 0;

  private pointerNdc = new THREE.Vector2(10, 10);
  private hasFinePointer = false;
  private lastPointer: Vec2 = { x: 0, y: 0 };
  private activePointerId: number | null = null;
  private pointerDownAt: Vec2 = { x: 0, y: 0 };
  private pointerTravel = 0;

  private visibleWidth = 4;
  private visibleHeight = 3;
  private worldPerPixel = 0.01;
  private gridWidth = GRID_COLS;
  private gridHeight = GRID_ROWS;

  private rafId: number | null = null;
  private lastTime = 0;
  private startTime = performance.now();
  private destroyed = false;
  private interacted = false;
  private resizeObserver?: ResizeObserver;
  private textures: THREE.Texture[] = [];
  private abortLoad = false;

  constructor(opts: GalleryAppOptions) {
    this.opts = opts;
    this.cfg = opts.config;
    this.gridWidth = GRID_COLS * this.cfg.cellWidth;
    this.gridHeight = GRID_ROWS * this.cfg.cellHeight;
    this.hasFinePointer =
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: fine)').matches;

    this.initRenderer();
    this.initPost();
    this.buildTiles();
    this.resize();
    this.bindEvents();
    this.loadTextures();
    this.start();
  }

  // ------------------------------------------------------------------ setup

  private initRenderer() {
    const { canvas } = this.opts;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0xffffff, 1);

    this.camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 50);
    this.camera.position.z = 5;

    this.renderTarget = new THREE.WebGLRenderTarget(2, 2, {
      samples: 4,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
    });
  }

  private initPost() {
    this.postMaterial = new THREE.ShaderMaterial({
      vertexShader: postVertexShader,
      fragmentShader: postFragmentShader,
      uniforms: {
        uScene: { value: this.renderTarget.texture },
        uTime: { value: 0 },
        uZoom: { value: OVERSCAN },
        uDistortion: { value: this.cfg.baseDistortion },
        uAberration: { value: this.cfg.minimumChromaticAberration },
        uVelocity: { value: new THREE.Vector2() },
        uBlur: { value: 0 },
        uVignette: { value: this.cfg.vignetteStrength },
        uGrain: { value: this.cfg.grainStrength },
        uFade: { value: 0 },
        uResolution: { value: new THREE.Vector2(1, 1) },
      },
      depthTest: false,
      depthWrite: false,
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.postMaterial);
    this.postScene.add(quad);
  }

  private tileSize(shape: GalleryItem['shape']): [number, number] {
    const w = this.cfg.tileWidth;
    if (shape === 'portrait') return [w, w * 1.075];
    if (shape === 'landscape') return [w, w * 0.78];
    return [w, w];
  }

  private buildTiles() {
    const { items } = this.opts;
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const item = items[(row * GRID_COLS + col) % items.length];
        const [tw, th] = this.tileSize(item.shape);

        const material = new THREE.ShaderMaterial({
          vertexShader: tileVertexShader,
          fragmentShader: tileFragmentShader,
          uniforms: {
            uMap: { value: null },
            uLoaded: { value: 0 },
            uHover: { value: 0 },
            uHoverScale: { value: this.cfg.hoverScale },
            uCurve: { value: this.cfg.baseCurvature },
            uCoverScale: { value: new THREE.Vector2(1, 1) },
            uCoverOffset: { value: new THREE.Vector2(0, 0) },
          },
        });

        const mesh = new THREE.Mesh(this.tileGeometry, material);
        mesh.scale.set(tw, th, 1);
        mesh.userData.index = row * GRID_COLS + col;

        this.tiles.push({
          mesh,
          baseX: col * this.cfg.cellWidth,
          baseY: row * this.cfg.cellHeight,
          hover: 0,
          loaded: 0,
          loadedTarget: 0,
        });
        this.scene.add(mesh);
      }
    }
  }

  /** Carregamento progressivo com fila de concorrência limitada. */
  private loadTextures() {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    const queue = this.tiles.map((tile, i) => ({ tile, item: this.opts.items[i % this.opts.items.length] }));
    let active = 0;

    const next = () => {
      if (this.abortLoad) return;
      while (active < this.cfg.textureConcurrency && queue.length > 0) {
        const { tile, item } = queue.shift()!;
        active++;
        loader.load(
          item.src,
          (texture) => {
            active--;
            if (this.abortLoad) {
              texture.dispose();
              return;
            }
            texture.colorSpace = THREE.NoColorSpace;
            texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.anisotropy = Math.min(
              4,
              this.renderer.capabilities.getMaxAnisotropy(),
            );
            this.textures.push(texture);

            // object-fit: cover — recorta a textura para a proporção do tile.
            const img = texture.image as { width: number; height: number };
            const planeAspect = tile.mesh.scale.x / tile.mesh.scale.y;
            const imgAspect = img.width / img.height;
            const scale = tile.mesh.material.uniforms.uCoverScale.value as THREE.Vector2;
            const offset = tile.mesh.material.uniforms.uCoverOffset.value as THREE.Vector2;
            if (imgAspect > planeAspect) {
              scale.set(planeAspect / imgAspect, 1);
              offset.set((1 - scale.x) / 2, 0);
            } else {
              scale.set(1, imgAspect / planeAspect);
              offset.set(0, (1 - scale.y) / 2);
            }

            tile.mesh.material.uniforms.uMap.value = texture;
            tile.loadedTarget = 1;
            next();
          },
          undefined,
          () => {
            active--;
            next();
          },
        );
      }
    };
    next();
  }

  // ------------------------------------------------------------------ events

  private bindEvents() {
    const el = this.opts.container;
    el.addEventListener('pointerdown', this.onPointerDown);
    el.addEventListener('pointermove', this.onPointerMove);
    el.addEventListener('pointerup', this.onPointerUp);
    el.addEventListener('pointercancel', this.onPointerUp);
    el.addEventListener('pointerleave', this.onPointerLeave);
    el.addEventListener('wheel', this.onWheel, { passive: false });
    el.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('visibilitychange', this.onVisibility);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(el);
    window.addEventListener('resize', this.onWindowResize);
  }

  private onWindowResize = () => this.resize();

  private markInteraction() {
    if (!this.interacted) {
      this.interacted = true;
      this.opts.onUserInteract?.();
    }
  }

  private onPointerDown = (e: PointerEvent) => {
    this.markInteraction();
    this.state.dragging = true;
    this.activePointerId = e.pointerId;
    this.lastPointer = { x: e.clientX, y: e.clientY };
    this.pointerDownAt = { x: e.clientX, y: e.clientY };
    this.pointerTravel = 0;
    this.velocity = { x: 0, y: 0 };
    try {
      this.opts.container.setPointerCapture(e.pointerId);
    } catch {
      // pointerId inválido (eventos sintéticos) — o arraste segue sem captura.
    }
  };

  private onPointerMove = (e: PointerEvent) => {
    if (this.hasFinePointer) {
      const rect = this.opts.container.getBoundingClientRect();
      this.pointerNdc.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
      );
    }
    if (!this.state.dragging || e.pointerId !== this.activePointerId) return;
    const dx = (e.clientX - this.lastPointer.x) * this.cfg.dragSensitivity;
    const dy = (e.clientY - this.lastPointer.y) * this.cfg.dragSensitivity;
    this.pointerTravel += Math.hypot(
      e.clientX - this.lastPointer.x,
      e.clientY - this.lastPointer.y,
    );
    this.lastPointer = { x: e.clientX, y: e.clientY };
    this.pendingDrag.x += dx * this.worldPerPixel;
    this.pendingDrag.y -= dy * this.worldPerPixel;
  };

  private onPointerUp = (e: PointerEvent) => {
    if (e.pointerId !== this.activePointerId) return;
    this.state.dragging = false;
    this.activePointerId = null;

    // Tap: pouco deslocamento acumulado entre down e up → clique no tile.
    const fromDown = Math.hypot(
      e.clientX - this.pointerDownAt.x,
      e.clientY - this.pointerDownAt.y,
    );
    if (fromDown < this.cfg.clickMaxDistance && this.pointerTravel < this.cfg.clickMaxDistance * 2) {
      this.handleTileClick(e.clientX, e.clientY);
    }
  };

  /** Raycast na posição do clique e notifica o item atingido. */
  private handleTileClick(clientX: number, clientY: number) {
    const rect = this.opts.container.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1,
    );
    this.raycaster.setFromCamera(ndc, this.camera);
    const hits = this.raycaster.intersectObjects(this.scene.children, false);
    if (hits.length === 0) return;
    const index = hits[0].object.userData.index as number;
    const item = this.opts.items[index % this.opts.items.length];
    this.opts.onItemClick?.(item, index);
  }

  private onPointerLeave = () => {
    this.pointerNdc.set(10, 10);
  };

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    this.markInteraction();
    const scale = e.deltaMode === 1 ? 16 : 1;
    let dx = e.deltaX * scale;
    let dy = e.deltaY * scale;
    if (e.shiftKey && Math.abs(dx) < 0.01) {
      dx = dy;
      dy = 0;
    }
    this.target.y += dy * this.cfg.wheelSensitivity * this.worldPerPixel;
    this.target.x -= dx * this.cfg.wheelSensitivity * this.worldPerPixel;
  };

  private onKeyDown = (e: KeyboardEvent) => {
    const step = this.cfg.cellWidth;
    let handled = true;
    if (e.key === 'ArrowLeft') this.target.x += step;
    else if (e.key === 'ArrowRight') this.target.x -= step;
    else if (e.key === 'ArrowUp') this.target.y -= step;
    else if (e.key === 'ArrowDown') this.target.y += step;
    else handled = false;
    if (handled) {
      e.preventDefault();
      this.markInteraction();
    }
  };

  private onVisibility = () => {
    if (document.hidden) this.stop();
    else this.start();
  };

  // ------------------------------------------------------------------ layout

  private resize() {
    const el = this.opts.container;
    const width = el.clientWidth || 1;
    const height = el.clientHeight || 1;
    const coarse = !this.hasFinePointer;
    const dpr = Math.min(
      window.devicePixelRatio || 1,
      coarse ? this.cfg.maxPixelRatioMobile : this.cfg.maxPixelRatioDesktop,
    );

    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height, false);
    this.renderTarget.setSize(
      Math.round(width * dpr),
      Math.round(height * dpr),
    );

    const columns =
      width < 640
        ? this.cfg.columnsMobile
        : width < 1024
          ? this.cfg.columnsTablet
          : this.cfg.columnsDesktop;

    const aspect = width / height;
    this.visibleWidth = columns * this.cfg.cellWidth * OVERSCAN;
    this.visibleHeight = this.visibleWidth / aspect;
    this.worldPerPixel = (columns * this.cfg.cellWidth) / width;

    this.camera.aspect = aspect;
    this.camera.position.z =
      this.visibleHeight / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    this.camera.updateProjectionMatrix();

    (this.postMaterial.uniforms.uResolution.value as THREE.Vector2).set(width, height);
  }

  // ------------------------------------------------------------------ loop

  private start() {
    if (this.rafId !== null || this.destroyed) return;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.update);
  }

  private stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private update = (now: number) => {
    this.rafId = null;
    if (this.destroyed) return;

    // dt normalizado para 60fps — física estável em qualquer refresh rate.
    const dt60 = Math.min((now - this.lastTime) / (1000 / 60), 3);
    this.lastTime = now;
    const cfg = this.cfg;
    const reduced = this.opts.reducedMotion;

    // --- física -----------------------------------------------------------
    if (this.state.dragging) {
      this.target.x += this.pendingDrag.x;
      this.target.y += this.pendingDrag.y;
      // Velocidade estimada pelo delta do ponteiro acumulado no frame.
      this.velocity.x = THREE.MathUtils.lerp(this.velocity.x, this.pendingDrag.x, 0.5);
      this.velocity.y = THREE.MathUtils.lerp(this.velocity.y, this.pendingDrag.y, 0.5);
      this.pendingDrag.x = 0;
      this.pendingDrag.y = 0;
    } else {
      // Momentum: o alvo continua andando e o atrito o desacelera.
      this.target.x += this.velocity.x * dt60;
      this.target.y += this.velocity.y * dt60;
      const friction = Math.pow(reduced ? 0.86 : cfg.friction, dt60);
      this.velocity.x *= friction;
      this.velocity.y *= friction;
    }

    const lerpK = 1 - Math.pow(1 - cfg.interpolation, dt60);
    this.current.x = THREE.MathUtils.lerp(this.current.x, this.target.x, lerpK);
    this.current.y = THREE.MathUtils.lerp(this.current.y, this.target.y, lerpK);

    const frameVx = (this.current.x - this.previous.x) / dt60;
    const frameVy = (this.current.y - this.previous.y) / dt60;
    this.previous.x = this.current.x;
    this.previous.y = this.current.y;

    // --- velocidade → intensidade dos efeitos ------------------------------
    const speed = Math.hypot(frameVx, frameVy);
    const speedNorm = Math.min(speed / cfg.speedForMaxEffect, 1);
    // Ataque rápido, decaimento suave — como no vídeo de referência.
    const ease = speedNorm > this.speedSmooth ? 0.14 : 0.05;
    this.speedSmooth += (speedNorm - this.speedSmooth) * ease * dt60;

    this.velSmooth.x = THREE.MathUtils.lerp(this.velSmooth.x, frameVx / this.visibleWidth, 0.12 * dt60);
    this.velSmooth.y = THREE.MathUtils.lerp(this.velSmooth.y, frameVy / this.visibleHeight, 0.12 * dt60);

    this.state.speed = this.speedSmooth;
    this.state.vx = this.velSmooth.x;
    this.state.vy = this.velSmooth.y;

    const effectScale = reduced ? 0.35 : 1;
    const curve =
      cfg.baseCurvature +
      (cfg.maximumCurvature - cfg.baseCurvature) * this.speedSmooth * effectScale;

    // --- grid infinito: reposiciona cada tile com wrap ----------------------
    const wrap = (v: number, size: number) =>
      ((v % size) + size * 1.5) % size - size * 0.5;

    for (const tile of this.tiles) {
      tile.mesh.position.x = wrap(tile.baseX + this.current.x, this.gridWidth);
      tile.mesh.position.y = wrap(tile.baseY + this.current.y, this.gridHeight);
      tile.mesh.material.uniforms.uCurve.value = curve;

      tile.loaded = THREE.MathUtils.lerp(tile.loaded, tile.loadedTarget, 0.06 * dt60);
      tile.mesh.material.uniforms.uLoaded.value = tile.loaded;
    }

    // --- hover (somente ponteiro fino, fora do arraste) ---------------------
    let hoveredIndex = -1;
    if (this.hasFinePointer && !this.state.dragging && this.pointerNdc.x < 5) {
      this.raycaster.setFromCamera(this.pointerNdc, this.camera);
      const hits = this.raycaster.intersectObjects(this.scene.children, false);
      if (hits.length > 0) hoveredIndex = hits[0].object.userData.index as number;
    }
    this.state.hovering = hoveredIndex >= 0;
    for (const tile of this.tiles) {
      const targetHover = tile.mesh.userData.index === hoveredIndex ? 1 : 0;
      tile.hover += (targetHover - tile.hover) * cfg.hoverEase * dt60;
      tile.mesh.material.uniforms.uHover.value = tile.hover;
    }

    // --- uniforms do pós-processamento --------------------------------------
    this.fade = THREE.MathUtils.lerp(this.fade, 1, 0.045 * dt60);
    const u = this.postMaterial.uniforms;
    u.uTime.value = (now - this.startTime) / 1000;
    u.uFade.value = this.fade;
    u.uZoom.value = OVERSCAN * (1 + cfg.motionZoom * this.speedSmooth * effectScale);
    u.uDistortion.value =
      cfg.baseDistortion +
      (cfg.maximumDistortion - cfg.baseDistortion) * this.speedSmooth * effectScale;
    u.uAberration.value = THREE.MathUtils.lerp(
      cfg.minimumChromaticAberration,
      cfg.maximumChromaticAberration * effectScale,
      this.speedSmooth,
    );
    (u.uVelocity.value as THREE.Vector2).set(this.velSmooth.x, this.velSmooth.y);
    u.uBlur.value = reduced ? 0 : cfg.motionBlurStrength * this.speedSmooth;
    u.uGrain.value = cfg.grainStrength * (reduced ? 0.5 : 1);

    // --- render: cena → FBO → pós-processamento -----------------------------
    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.postScene, this.postCamera);

    this.rafId = requestAnimationFrame(this.update);
  };

  // ------------------------------------------------------------------ teardown

  destroy() {
    this.destroyed = true;
    this.abortLoad = true;
    this.stop();

    const el = this.opts.container;
    el.removeEventListener('pointerdown', this.onPointerDown);
    el.removeEventListener('pointermove', this.onPointerMove);
    el.removeEventListener('pointerup', this.onPointerUp);
    el.removeEventListener('pointercancel', this.onPointerUp);
    el.removeEventListener('pointerleave', this.onPointerLeave);
    el.removeEventListener('wheel', this.onWheel);
    el.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('visibilitychange', this.onVisibility);
    window.removeEventListener('resize', this.onWindowResize);
    this.resizeObserver?.disconnect();

    for (const tile of this.tiles) tile.mesh.material.dispose();
    this.tileGeometry.dispose();
    for (const texture of this.textures) texture.dispose();
    this.postMaterial.dispose();
    this.renderTarget.dispose();
    this.renderer.dispose();
  }
}
