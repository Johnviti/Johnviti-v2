import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Billboard, useProgress, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { CONTACT_EMAIL, PROJECTS, VERSIONS } from '@/data/site';

const RADIUS = 3.25;

const CARD_POSITIONS = [
  { theta: 0, phi: 0.02 },
  { theta: Math.PI * 0.42, phi: 0.42 },
  { theta: Math.PI * 0.82, phi: -0.3 },
  { theta: Math.PI * 1.22, phi: 0.35 },
  { theta: Math.PI * 1.65, phi: -0.38 },
] as const;

type RotationTarget = MutableRefObject<{ x: number; y: number }>;

const OrbitCard = ({
  project,
  index,
  selected,
  onSelect,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
  selected: boolean;
  onSelect: (index: number) => void;
}) => {
  const texture = useTexture(project.image);
  const group = useRef<THREE.Group>(null);
  const { theta, phi } = CARD_POSITIONS[index];
  const position: [number, number, number] = [
    Math.sin(theta) * Math.cos(phi) * RADIUS,
    Math.sin(phi) * RADIUS,
    Math.cos(theta) * Math.cos(phi) * RADIUS,
  ];

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const targetScale = selected ? 1.18 : 1;
    group.current.scale.setScalar(
      THREE.MathUtils.damp(group.current.scale.x, targetScale, 6, delta),
    );
    group.current.position.y =
      Math.sin(clock.elapsedTime * 0.75 + index * 1.7) * 0.08;
  });

  return (
    <Billboard position={position} follow>
      <group ref={group}>
        <mesh position={[0, 0, -0.035]}>
          <planeGeometry args={[2.18, 1.53]} />
          <meshBasicMaterial
            color={selected ? '#f5f5f2' : '#24262a'}
            transparent
            opacity={selected ? 1 : 0.8}
          />
        </mesh>
        <mesh
          onClick={(event) => {
            event.stopPropagation();
            onSelect(index);
          }}
          onPointerOver={() => {
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto';
          }}
        >
          <planeGeometry args={[2.08, 1.41]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      </group>
    </Billboard>
  );
};

const OrbitScene = ({
  selected,
  rotationTarget,
  dragging,
  onSelect,
}: {
  selected: number;
  rotationTarget: RotationTarget;
  dragging: MutableRefObject<boolean>;
  onSelect: (index: number) => void;
}) => {
  const orbit = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!orbit.current) return;
    if (!dragging.current) rotationTarget.current.y += delta * 0.045;
    orbit.current.rotation.x = THREE.MathUtils.damp(
      orbit.current.rotation.x,
      rotationTarget.current.x,
      5,
      delta,
    );
    orbit.current.rotation.y = THREE.MathUtils.damp(
      orbit.current.rotation.y,
      rotationTarget.current.y,
      5,
      delta,
    );
  });

  return (
    <>
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 8, 18]} />
      <group ref={orbit}>
        <mesh>
          <sphereGeometry args={[RADIUS - 0.32, 34, 22]} />
          <meshBasicMaterial
            color="#35373d"
            wireframe
            transparent
            opacity={0.48}
          />
        </mesh>

        <Suspense fallback={null}>
          {PROJECTS.map((project, index) => (
            <OrbitCard
              key={project.title}
              project={project}
              index={index}
              selected={selected === index}
              onSelect={onSelect}
            />
          ))}
        </Suspense>
      </group>
    </>
  );
};

const OrbitPage = () => {
  const [selected, setSelected] = useState(0);
  const rotationTarget = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const dragOrigin = useRef({ x: 0, y: 0 });
  const rotationOrigin = useRef({ x: 0, y: 0 });
  const { active } = useProgress();
  const project = PROJECTS[selected];

  useEffect(() => {
    document.title = 'John Amorim';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

  const selectProject = (index: number) => {
    setSelected(index);
    const point = CARD_POSITIONS[index];
    rotationTarget.current.x = point.phi * 0.72;
    rotationTarget.current.y = -point.theta;
  };

  const beginDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('a, button')) return;
    dragging.current = true;
    dragOrigin.current = { x: event.clientX, y: event.clientY };
    rotationOrigin.current = { ...rotationTarget.current };
  };

  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    rotationTarget.current.y =
      rotationOrigin.current.y + (event.clientX - dragOrigin.current.x) * 0.006;
    rotationTarget.current.x = THREE.MathUtils.clamp(
      rotationOrigin.current.x + (event.clientY - dragOrigin.current.y) * 0.004,
      -0.75,
      0.75,
    );
  };

  const endDrag = () => {
    dragging.current = false;
  };

  return (
    <div
      className="fixed inset-0 touch-none overflow-hidden bg-[#050505] font-grotesk text-white"
      onPointerDown={beginDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <Canvas camera={{ position: [0, 0, 10.5], fov: 48 }} dpr={[1, 1.7]}>
        <OrbitScene
          selected={selected}
          rotationTarget={rotationTarget}
          dragging={dragging}
          onSelect={selectProject}
        />
      </Canvas>

      <header className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 text-[11px] uppercase tracking-[0.08em] md:p-6">
        <a
          href="/"
          className="pointer-events-auto text-sm font-medium normal-case tracking-tight transition-opacity hover:opacity-60"
        >
          john amorim<sup className="ml-0.5 text-[0.55em]">®</sup>
        </a>
        <nav className="pointer-events-auto flex items-center gap-4 md:gap-6">
          <a href="/" className="transition-opacity hover:opacity-50">
            índice
          </a>
          <button
            type="button"
            onClick={() => selectProject((selected + 1) % PROJECTS.length)}
            className="uppercase tracking-[0.08em] transition-opacity hover:opacity-50"
          >
            projetos
          </button>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="hidden transition-opacity hover:opacity-50 sm:block"
          >
            contato
          </a>
          <a
            href="/mosaico"
            aria-label="Abrir versão mosaico"
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[12px] text-black transition-transform hover:rotate-90"
          >
            +
          </a>
        </nav>
      </header>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-4 md:p-6">
        <div className="max-w-sm">
          <p className="text-[10px] uppercase tracking-[0.14em] text-white/45">
            {String(selected + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')} ·{' '}
            {project.client}
          </p>
          <h1 className="mt-1 text-lg font-medium leading-tight tracking-tight md:text-2xl">
            {project.title}
          </h1>
          <p className="mt-2 hidden max-w-xs text-xs leading-relaxed text-white/50 md:block">
            Arraste para girar · toque em um projeto para aproximar
          </p>
        </div>
        <div className="pointer-events-auto flex flex-col items-end gap-2 text-[10px] uppercase tracking-[0.12em] text-white/50">
          <span>© {new Date().getFullYear()}</span>
          <div className="hidden gap-3 md:flex">
            {VERSIONS.filter((version) =>
              ['/', '/minimal', '/mosaico'].includes(version.path),
            ).map((version) => (
              <a
                key={version.path}
                href={version.path}
                className="transition-colors hover:text-white"
              >
                {version.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {active && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#050505] text-xs uppercase tracking-[0.18em] text-white/60">
          carregando órbita…
        </div>
      )}
    </div>
  );
};

export default OrbitPage;
