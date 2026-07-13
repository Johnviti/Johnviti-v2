import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshReflectorMaterial, useProgress, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { PROJECTS, VERSIONS } from '@/data/site';

const SPACING = 5.2;
const CENTER_X = ((PROJECTS.length - 1) * SPACING) / 2;

const Painting = ({
  project,
  index,
  onSelect,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
  onSelect: (index: number) => void;
}) => {
  const texture = useTexture(project.image);
  const spot = useRef<THREE.SpotLight>(null);
  const target = useRef<THREE.Object3D>(null);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);

  useEffect(() => {
    if (spot.current && target.current) {
      spot.current.target = target.current;
    }
  }, []);

  return (
    <group position={[index * SPACING, 0, 0]}>
      <object3D ref={target} position={[0, 1.7, 0]} />
      <spotLight
        ref={spot}
        position={[0, 4, 2.8]}
        angle={0.55}
        penumbra={0.7}
        intensity={45}
        distance={14}
        color="#fff3e0"
      />
      <mesh position={[0, 1.7, -0.06]}>
        <boxGeometry args={[3.74, 2.64, 0.1]} />
        <meshStandardMaterial color="#2b2622" roughness={0.55} metalness={0.25} />
      </mesh>
      <mesh
        position={[0, 1.7, 0.01]}
        onClick={() => onSelect(index)}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <planeGeometry args={[3.5, 2.37]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
};

const CameraRig = ({ index }: { index: number }) => {
  const { camera, pointer } = useThree();

  useFrame((_, delta) => {
    const targetX = index * SPACING;
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      targetX + pointer.x * 0.35,
      3,
      delta,
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      1.6 + pointer.y * 0.15,
      3,
      delta,
    );
    camera.lookAt(targetX, 1.55, 0);
  });

  return null;
};

const Scene = ({
  index,
  onSelect,
}: {
  index: number;
  onSelect: (index: number) => void;
}) => {
  return (
    <>
      <color attach="background" args={['#0e0d0c']} />
      <fog attach="fog" args={['#0e0d0c', 9, 26]} />
      <ambientLight intensity={0.5} />

      <Suspense fallback={null}>
        {PROJECTS.map((project, i) => (
          <Painting key={project.title} project={project} index={i} onSelect={onSelect} />
        ))}
      </Suspense>

      {/* Back wall */}
      <mesh position={[CENTER_X, 4, -0.2]}>
        <planeGeometry args={[PROJECTS.length * SPACING + 30, 12]} />
        <meshStandardMaterial color="#191714" roughness={0.95} />
      </mesh>

      {/* Reflective floor */}
      <mesh rotation-x={-Math.PI / 2} position={[CENTER_X, 0, 4]}>
        <planeGeometry args={[PROJECTS.length * SPACING + 40, 24]} />
        <MeshReflectorMaterial
          blur={[280, 90]}
          resolution={512}
          mixBlur={1}
          mixStrength={40}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0b0a09"
          metalness={0.55}
          mirror={0.6}
        />
      </mesh>

      <CameraRig index={index} />
    </>
  );
};

const GalleryPage = () => {
  const [index, setIndex] = useState(0);
  const { active } = useProgress();
  const project = PROJECTS[index];

  useEffect(() => {
    document.title = 'john amorim — galeria 3d';
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(i + 1, PROJECTS.length - 1));
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#0e0d0c] font-grotesk text-[#f2f0ea]">
      <Canvas camera={{ position: [0, 1.6, 4.8], fov: 55 }} dpr={[1, 2]}>
        <Scene index={index} onSelect={setIndex} />
      </Canvas>

      {/* Overlay */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-5 md:p-8">
        <div className="flex items-start justify-between text-sm">
          <a
            href="/"
            className="pointer-events-auto transition-opacity hover:opacity-60"
          >
            ← john amorim<sup className="text-[0.6em]">®</sup>
          </a>
          <nav className="pointer-events-auto flex gap-4 text-[#f2f0ea]/60">
            {VERSIONS.filter((v) => v.path !== '/galeria').map((version) => (
              <a
                key={version.path}
                href={version.path}
                className="transition-colors hover:text-[#f2f0ea]"
              >
                {version.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-end justify-between gap-6">
          <div className="max-w-md">
            <p className="text-sm text-[#f2f0ea]/50">
              {String(index + 1).padStart(2, '0')} — {project.client} · {project.category}
            </p>
            <h1 className="mt-1 text-2xl font-medium leading-tight tracking-tight md:text-4xl">
              {project.title}
            </h1>
            <p className="mt-2 hidden text-sm leading-relaxed text-[#f2f0ea]/60 md:block">
              {project.description}
            </p>
          </div>

          <div className="pointer-events-auto flex shrink-0 items-center gap-3">
            <button
              onClick={() => setIndex((i) => Math.max(i - 1, 0))}
              disabled={index === 0}
              aria-label="Projeto anterior"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#f2f0ea]/30 transition-colors hover:bg-[#f2f0ea] hover:text-[#0e0d0c] disabled:pointer-events-none disabled:opacity-30"
            >
              ←
            </button>
            <span className="text-sm tabular-nums text-[#f2f0ea]/60">
              {index + 1} / {PROJECTS.length}
            </span>
            <button
              onClick={() => setIndex((i) => Math.min(i + 1, PROJECTS.length - 1))}
              disabled={index === PROJECTS.length - 1}
              aria-label="Próximo projeto"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#f2f0ea]/30 transition-colors hover:bg-[#f2f0ea] hover:text-[#0e0d0c] disabled:pointer-events-none disabled:opacity-30"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {active && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0e0d0c]">
          <span className="animate-pulse text-sm">carregando galeria…</span>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
