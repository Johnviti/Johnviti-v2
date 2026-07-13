import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentRef,
  type MutableRefObject,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Billboard,
  PointerLockControls,
  Sky,
  Text,
  useProgress,
  useTexture,
} from '@react-three/drei';
import * as THREE from 'three';
import { PROJECTS, VERSIONS } from '@/data/site';

const WORLD_RADIUS = 46;
const EXHIBIT_RADIUS = 13;
const NEAR_DISTANCE = 4.5;
const UP = new THREE.Vector3(0, 1, 0);

const EXHIBIT_POSITIONS = PROJECTS.map((_, i) => {
  const angle = (i / PROJECTS.length) * Math.PI * 2;
  return {
    angle,
    position: new THREE.Vector3(
      Math.sin(angle) * EXHIBIT_RADIUS,
      0,
      -Math.cos(angle) * EXHIBIT_RADIUS,
    ),
  };
});

type LookDelta = MutableRefObject<{ dx: number; dy: number }>;
type MoveState = MutableRefObject<{ forward: boolean }>;

const Exhibit = ({ project, index }: { project: (typeof PROJECTS)[number]; index: number }) => {
  const { angle, position } = EXHIBIT_POSITIONS[index];
  const texture = useTexture(project.image);
  const panel = useRef<THREE.Group>(null);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);

  useFrame(({ clock }) => {
    if (panel.current) {
      panel.current.position.y = 2.4 + Math.sin(clock.elapsedTime * 0.8 + index * 2) * 0.12;
    }
  });

  return (
    <group position={position} rotation={[0, -angle, 0]}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.32, 0.45, 1, 12]} />
        <meshStandardMaterial color="#efeee8" roughness={0.8} />
      </mesh>

      <group ref={panel} position={[0, 2.4, 0]}>
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[2.74, 1.94, 0.09]} />
          <meshStandardMaterial color="#232120" roughness={0.5} />
        </mesh>
        <mesh>
          <planeGeometry args={[2.56, 1.76]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
        <Billboard position={[0, 1.25, 0]}>
          <Text fontSize={0.2} color="#232120" anchorX="center" maxWidth={4}>
            {`${String(index + 1).padStart(2, '0')} — ${project.title}`}
          </Text>
        </Billboard>
      </group>

      <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 0]}>
        <ringGeometry args={[1.55, 1.72, 48]} />
        <meshBasicMaterial color="#f6f5ef" transparent opacity={0.85} />
      </mesh>
    </group>
  );
};

const CenterTotem = () => {
  const knot = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (knot.current) {
      knot.current.rotation.y += delta * 0.5;
      knot.current.rotation.x += delta * 0.15;
    }
  });

  return (
    <group>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.5, 0.62, 0.8, 16]} />
        <meshStandardMaterial color="#efeee8" roughness={0.8} />
      </mesh>
      <mesh ref={knot} position={[0, 1.7, 0]}>
        <torusKnotGeometry args={[0.34, 0.11, 96, 16]} />
        <meshStandardMaterial color="#232120" roughness={0.35} metalness={0.5} />
      </mesh>
      <Billboard position={[0, 2.8, 0]}>
        <Text fontSize={0.3} color="#232120" anchorX="center">
          john amorim
        </Text>
      </Billboard>
    </group>
  );
};

const Decorations = () => {
  const items = useMemo(() => {
    let seed = 1337;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    return Array.from({ length: 70 }, () => {
      const angle = rand() * Math.PI * 2;
      const radius = 17.5 + rand() * 27;
      return {
        x: Math.sin(angle) * radius,
        z: Math.cos(angle) * radius,
        type: rand() < 0.72 ? 'tree' : 'rock',
        scale: 0.7 + rand() * 1.1,
        rotation: rand() * Math.PI * 2,
      };
    });
  }, []);

  return (
    <>
      {items.map((item, i) =>
        item.type === 'tree' ? (
          <group key={i} position={[item.x, 0, item.z]} rotation={[0, item.rotation, 0]} scale={item.scale}>
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.12, 0.18, 1, 6]} />
              <meshStandardMaterial color="#8a6a4f" flatShading />
            </mesh>
            <mesh position={[0, 1.6, 0]}>
              <coneGeometry args={[0.85, 2.3, 7]} />
              <meshStandardMaterial color={i % 3 === 0 ? '#597a4c' : '#6b8f5b'} flatShading />
            </mesh>
          </group>
        ) : (
          <mesh key={i} position={[item.x, 0.25, item.z]} rotation={[0, item.rotation, 0]} scale={item.scale}>
            <dodecahedronGeometry args={[0.45, 0]} />
            <meshStandardMaterial color="#a8a294" flatShading />
          </mesh>
        ),
      )}
    </>
  );
};

const Player = ({
  enabled,
  lookDelta,
  moveState,
  onNear,
}: {
  enabled: boolean;
  lookDelta: LookDelta;
  moveState: MoveState;
  onNear: (index: number) => void;
}) => {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const nearRef = useRef(-1);
  const forward = useMemo(() => new THREE.Vector3(), []);
  const right = useMemo(() => new THREE.Vector3(), []);
  const move = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => (keys.current[e.code] = true);
    const up = (e: KeyboardEvent) => (keys.current[e.code] = false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  useFrame((_, rawDelta) => {
    if (!enabled) return;
    const delta = Math.min(rawDelta, 0.1);

    // Touch look
    const look = lookDelta.current;
    if (look.dx !== 0 || look.dy !== 0) {
      camera.rotation.order = 'YXZ';
      camera.rotation.y -= look.dx * 0.004;
      camera.rotation.x = THREE.MathUtils.clamp(
        camera.rotation.x - look.dy * 0.004,
        -1.2,
        1.2,
      );
      look.dx = 0;
      look.dy = 0;
    }

    // Movement
    const k = keys.current;
    const mz =
      (k.KeyW || k.ArrowUp || moveState.current.forward ? 1 : 0) -
      (k.KeyS || k.ArrowDown ? 1 : 0);
    const mx = (k.KeyD || k.ArrowRight ? 1 : 0) - (k.KeyA || k.ArrowLeft ? 1 : 0);

    if (mz !== 0 || mx !== 0) {
      camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();
      right.crossVectors(forward, UP);
      move
        .copy(forward)
        .multiplyScalar(mz)
        .addScaledVector(right, mx)
        .normalize()
        .multiplyScalar((k.ShiftLeft || k.ShiftRight ? 9 : 5.5) * delta);
      camera.position.add(move);
    }

    camera.position.y = 1.7;

    // World bounds
    const dist = Math.hypot(camera.position.x, camera.position.z);
    if (dist > WORLD_RADIUS) {
      camera.position.x *= WORLD_RADIUS / dist;
      camera.position.z *= WORLD_RADIUS / dist;
    }

    // Proximity to exhibits
    let nearest = -1;
    let best = NEAR_DISTANCE * NEAR_DISTANCE;
    EXHIBIT_POSITIONS.forEach(({ position }, i) => {
      const dx = camera.position.x - position.x;
      const dz = camera.position.z - position.z;
      const d = dx * dx + dz * dz;
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    if (nearest !== nearRef.current) {
      nearRef.current = nearest;
      onNear(nearest);
    }
  });

  return null;
};

const WorldScene = ({
  enabled,
  lookDelta,
  moveState,
  onNear,
}: {
  enabled: boolean;
  lookDelta: LookDelta;
  moveState: MoveState;
  onNear: (index: number) => void;
}) => {
  return (
    <>
      <fog attach="fog" args={['#dfe8d8', 28, 85]} />
      <Sky sunPosition={[40, 30, -20]} turbidity={6} />
      <hemisphereLight args={['#eaf2ff', '#8fa77e', 0.9]} />
      <directionalLight position={[30, 40, -10]} intensity={1.6} color="#fff4e0" />

      {/* Ground */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
        <circleGeometry args={[70, 64]} />
        <meshStandardMaterial color="#a9bd93" />
      </mesh>

      <CenterTotem />
      <Decorations />

      <Suspense fallback={null}>
        {PROJECTS.map((project, i) => (
          <Exhibit key={project.title} project={project} index={i} />
        ))}
      </Suspense>

      <Player enabled={enabled} lookDelta={lookDelta} moveState={moveState} onNear={onNear} />
    </>
  );
};

const WorldPage = () => {
  const [playing, setPlaying] = useState(false);
  const [near, setNear] = useState(-1);
  const { active } = useProgress();
  const controls = useRef<ComponentRef<typeof PointerLockControls>>(null);
  const lookDelta = useRef({ dx: 0, dy: 0 });
  const moveState = useRef({ forward: false });
  const lastTouch = useRef<{ x: number; y: number } | null>(null);
  const isTouch = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches,
    [],
  );

  useEffect(() => {
    document.title = 'john amorim — mundo 3d';
  }, []);

  const enter = () => {
    if (isTouch) {
      setPlaying(true);
    } else {
      controls.current?.lock();
    }
  };

  const nearProject = near >= 0 ? PROJECTS[near] : null;

  return (
    <div
      className="fixed inset-0 touch-none overflow-hidden bg-[#dfe8d8] font-grotesk text-ink"
      onTouchStart={(e) => {
        if (!playing || !isTouch) return;
        const t = e.touches[0];
        lastTouch.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchMove={(e) => {
        if (!playing || !isTouch || !lastTouch.current) return;
        const t = e.touches[0];
        lookDelta.current.dx += t.clientX - lastTouch.current.x;
        lookDelta.current.dy += t.clientY - lastTouch.current.y;
        lastTouch.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchEnd={() => (lastTouch.current = null)}
    >
      <Canvas camera={{ position: [0, 1.7, 7], fov: 70 }} dpr={[1, 1.5]}>
        <WorldScene
          enabled={playing}
          lookDelta={lookDelta}
          moveState={moveState}
          onNear={setNear}
        />
        {!isTouch && (
          <PointerLockControls
            ref={controls}
            onLock={() => setPlaying(true)}
            onUnlock={() => setPlaying(false)}
          />
        )}
      </Canvas>

      {/* Crosshair */}
      {playing && !isTouch && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/60" />
      )}

      {/* Proximity card */}
      {playing && nearProject && (
        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center px-5">
          <div className="max-w-md rounded-xl bg-cream/95 p-5 text-center shadow-xl backdrop-blur">
            <p className="text-xs uppercase tracking-wide text-stone-soft">
              {String(near + 1).padStart(2, '0')} — {nearProject.client} · {nearProject.category}
            </p>
            <h2 className="mt-1 text-xl font-medium leading-tight">{nearProject.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-soft">
              {nearProject.description}
            </p>
          </div>
        </div>
      )}

      {/* HUD hint */}
      {playing && (
        <div className="pointer-events-none absolute left-1/2 top-5 -translate-x-1/2 rounded-full bg-ink/70 px-4 py-1.5 text-xs text-cream">
          {isTouch
            ? 'Arraste para olhar · segure o botão para andar'
            : 'WASD para andar · mouse para olhar · ESC para sair'}
        </div>
      )}

      {/* Touch controls */}
      {playing && isTouch && (
        <>
          <button
            className="absolute bottom-24 left-1/2 h-20 w-20 -translate-x-1/2 select-none rounded-full border-2 border-ink/40 bg-cream/80 text-sm font-medium backdrop-blur active:bg-ink active:text-cream"
            onTouchStart={(e) => {
              e.stopPropagation();
              moveState.current.forward = true;
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              moveState.current.forward = false;
            }}
          >
            andar
          </button>
          <button
            onClick={() => setPlaying(false)}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-ink/70 text-cream"
            aria-label="Sair da exploração"
          >
            ✕
          </button>
        </>
      )}

      {/* Start screen */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center bg-ink/40 p-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-cream p-8 text-center shadow-2xl">
            <p className="text-xs uppercase tracking-wide text-stone-soft">mundo 3d</p>
            <h1 className="mt-2 text-3xl font-medium tracking-tight">
              Explore meus projetos
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-stone-soft">
              {isTouch
                ? 'Arraste para olhar ao redor e segure o botão para andar. Aproxime-se dos totens para conhecer cada projeto.'
                : 'Use WASD (ou setas) para andar e o mouse para olhar ao redor. Aproxime-se dos totens para conhecer cada projeto.'}
            </p>
            <button
              onClick={enter}
              disabled={active}
              className="mt-6 w-full rounded-full bg-ink px-6 py-3 font-medium text-cream transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {active ? 'carregando mundo…' : 'Entrar no mundo →'}
            </button>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-stone-soft">
              <a href="/" className="underline-offset-4 hover:text-ink hover:underline">
                ← voltar ao site
              </a>
              {VERSIONS.filter((v) => v.path !== '/mundo' && v.path !== '/').map((version) => (
                <a
                  key={version.path}
                  href={version.path}
                  className="underline-offset-4 hover:text-ink hover:underline"
                >
                  {version.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorldPage;
