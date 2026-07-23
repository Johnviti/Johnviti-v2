import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Porta-copos de cortiça em 3D: cilindro fino com textura procedural de
 * "grão de cortiça" gerada em canvas. Gira devagar e inclina seguindo o
 * ponteiro. `stack` empilha discos (usado nos cards de produto).
 */

function makeCorkTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base em tom de cortiça clara.
  ctx.fillStyle = '#c8a172';
  ctx.fillRect(0, 0, size, size);

  // Grãos: manchas elípticas em tons quentes variados.
  const tones = ['#b08954', '#d8b488', '#a67c48', '#e0c096', '#8f683a'];
  for (let i = 0; i < 2600; i++) {
    ctx.fillStyle = tones[i % tones.length];
    ctx.globalAlpha = 0.25 + Math.random() * 0.45;
    const x = Math.random() * size;
    const y = Math.random() * size;
    const w = 1 + Math.random() * 7;
    const h = 1 + Math.random() * 3;
    const r = Math.random() * Math.PI;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(r);
    ctx.beginPath();
    ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function CoasterStack({ stack }: { stack: number }) {
  const group = useRef<THREE.Group>(null);
  const texture = useMemo(() => makeCorkTexture(), []);
  const pointer = useRef({ x: 0, y: 0 });

  useFrame(({ pointer: p }, delta) => {
    const g = group.current;
    if (!g) return;
    pointer.current.x += (p.x - pointer.current.x) * 0.05;
    pointer.current.y += (p.y - pointer.current.y) * 0.05;
    g.rotation.y += delta * 0.45;
    g.rotation.x = 0.42 + pointer.current.y * -0.25;
    g.rotation.z = pointer.current.x * 0.18;
  });

  const discs = Array.from({ length: stack }, (_, i) => i);
  const thickness = 0.16;

  return (
    <group ref={group}>
      {discs.map((i) => (
        <mesh
          key={i}
          position={[0, (i - (stack - 1) / 2) * (thickness + 0.015), 0]}
          castShadow
        >
          <cylinderGeometry args={[1, 1, thickness, 96]} />
          <meshStandardMaterial
            map={texture}
            bumpMap={texture}
            bumpScale={0.35}
            roughness={0.88}
            metalness={0}
          />
        </mesh>
      ))}
    </group>
  );
}

type Props = {
  stack?: number;
  className?: string;
};

export default function CoasterCanvas({ stack = 1, className }: Props) {
  return (
    <div className={className} aria-hidden>
      <Canvas
        camera={{ position: [0, 0.9, 2.6], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        shadows
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.55} />
        {/* Key quente, fill frio suave e rim laranja para descolar do fundo. */}
        <directionalLight
          position={[3, 4, 2]}
          intensity={2.1}
          color="#ffedd7"
          castShadow
        />
        <directionalLight position={[-2.5, 1.5, -1]} intensity={0.35} color="#8fa3c8" />
        <directionalLight position={[-3, -1, -2]} intensity={0.6} color="#dc5000" />
        <Float speed={1.6} rotationIntensity={0.15} floatIntensity={0.4}>
          <CoasterStack stack={stack} />
        </Float>
        <ContactShadows
          position={[0, -0.9, 0]}
          opacity={0.55}
          scale={5}
          blur={2.6}
          far={2}
          color="#000000"
        />
      </Canvas>
    </div>
  );
}
