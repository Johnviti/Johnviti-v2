import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Billboard, Text, useProgress, useTexture } from '@react-three/drei';
import {
  CuboidCollider,
  CylinderCollider,
  Physics,
  RigidBody,
  type RapierRigidBody,
} from '@react-three/rapier';
import * as THREE from 'three';
import { CONTACT_EMAIL, PROJECTS, SOCIALS, VERSIONS } from '@/data/site';

const WORLD_HALF = 58;
const SPAWN_POSITION: [number, number, number] = [0, 0.7, 12];
const CAMERA_OFFSET = new THREE.Vector3(0, 13, 14);
const MAX_FORWARD_SPEED = 16;
const MAX_REVERSE_SPEED = 7;
const ACCELERATION = 24;
const COAST_DRAG = 1.4;
const WHEEL_RADIUS = 0.34;
const EXHIBIT_RADIUS = 30;
const NEAR_DISTANCE = 6.5;
const CONTACT_POSITION = new THREE.Vector3(0, 0, 30);

// Scratch objects reused across frames to avoid per-frame allocations
const scratchQuat = new THREE.Quaternion();
const scratchForward = new THREE.Vector3();
const scratchCamPos = new THREE.Vector3();
const scratchLook = new THREE.Vector3();
const camLookTarget = new THREE.Vector3(0, 0.6, 0);

const EXHIBIT_SPOTS = PROJECTS.map((_, i) => {
  const arc = Math.PI * 0.85;
  const angle = -arc / 2 + (i / (PROJECTS.length - 1)) * arc;
  return {
    angle,
    position: new THREE.Vector3(
      Math.sin(angle) * EXHIBIT_RADIUS,
      0,
      -Math.cos(angle) * EXHIBIT_RADIUS,
    ),
  };
});

type JoystickRef = MutableRefObject<{ x: number; y: number }>;

const CarRig = ({
  enabled,
  joystick,
  resetRef,
  onNear,
  onContactNear,
}: {
  enabled: boolean;
  joystick: JoystickRef;
  resetRef: MutableRefObject<() => void>;
  onNear: (index: number) => void;
  onContactNear: (near: boolean) => void;
}) => {
  const bodyRef = useRef<RapierRigidBody>(null);
  const keys = useRef<Record<string, boolean>>({});
  const spin = useRef(0);
  const spinGroups = useRef<(THREE.Group | null)[]>([]);
  const steerGroups = useRef<(THREE.Group | null)[]>([]);
  const nearIndex = useRef(-1);
  const contactNear = useRef(false);

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

  const reset = useCallback(() => {
    const body = bodyRef.current;
    if (!body) return;
    body.setTranslation(
      { x: SPAWN_POSITION[0], y: SPAWN_POSITION[1], z: SPAWN_POSITION[2] },
      true,
    );
    body.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
    body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    body.setAngvel({ x: 0, y: 0, z: 0 }, true);
  }, []);

  useEffect(() => {
    resetRef.current = reset;
  }, [reset, resetRef]);

  useFrame((state, rawDelta) => {
    const body = bodyRef.current;
    if (!body) return;
    const delta = Math.min(rawDelta, 1 / 30);

    let throttle = 0;
    let steer = 0;
    if (enabled) {
      const k = keys.current;
      throttle =
        (k.KeyW || k.ArrowUp ? 1 : 0) -
        (k.KeyS || k.ArrowDown ? 1 : 0) +
        joystick.current.y;
      steer =
        (k.KeyA || k.ArrowLeft ? 1 : 0) -
        (k.KeyD || k.ArrowRight ? 1 : 0) -
        joystick.current.x;
      throttle = THREE.MathUtils.clamp(throttle, -1, 1);
      steer = THREE.MathUtils.clamp(steer, -1, 1);
    }

    const rotation = body.rotation();
    scratchQuat.set(rotation.x, rotation.y, rotation.z, rotation.w);
    scratchForward.set(0, 0, -1).applyQuaternion(scratchQuat);
    const velocity = body.linvel();
    let forwardSpeed =
      velocity.x * scratchForward.x + velocity.z * scratchForward.z;

    if (throttle !== 0) {
      forwardSpeed += throttle * ACCELERATION * delta;
    } else {
      forwardSpeed *= Math.max(0, 1 - COAST_DRAG * delta);
    }
    forwardSpeed = THREE.MathUtils.clamp(
      forwardSpeed,
      -MAX_REVERSE_SPEED,
      MAX_FORWARD_SPEED,
    );

    body.setLinvel(
      {
        x: scratchForward.x * forwardSpeed,
        y: velocity.y,
        z: scratchForward.z * forwardSpeed,
      },
      true,
    );

    const grip = THREE.MathUtils.clamp(Math.abs(forwardSpeed) / 5, 0, 1);
    const reverseDir = forwardSpeed < -0.4 ? -1 : 1;
    body.setAngvel({ x: 0, y: steer * 2.5 * grip * reverseDir, z: 0 }, true);

    // Wheels: spin with travel, front pair follows the steering input
    spin.current += (forwardSpeed * delta) / WHEEL_RADIUS;
    for (const wheel of spinGroups.current) {
      if (wheel) wheel.rotation.x = spin.current;
    }
    const steerLerp = 1 - Math.exp(-10 * delta);
    for (const front of steerGroups.current) {
      if (front) {
        front.rotation.y = THREE.MathUtils.lerp(
          front.rotation.y,
          steer * 0.42,
          steerLerp,
        );
      }
    }

    const p = body.translation();
    if (p.y < -6) reset();

    // Bruno-Simon-style camera: fixed world angle, pans with the car
    scratchCamPos.set(
      p.x + CAMERA_OFFSET.x,
      CAMERA_OFFSET.y,
      p.z + CAMERA_OFFSET.z,
    );
    state.camera.position.lerp(scratchCamPos, 1 - Math.exp(-5 * delta));
    scratchLook.set(p.x, 0.6, p.z);
    camLookTarget.lerp(scratchLook, 1 - Math.exp(-7 * delta));
    state.camera.lookAt(camLookTarget);

    // Proximity to project exhibits
    let nearest = -1;
    let best = NEAR_DISTANCE * NEAR_DISTANCE;
    EXHIBIT_SPOTS.forEach(({ position }, i) => {
      const dx = p.x - position.x;
      const dz = p.z - position.z;
      const d = dx * dx + dz * dz;
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    if (nearest !== nearIndex.current) {
      nearIndex.current = nearest;
      onNear(nearest);
    }

    const cdx = p.x - CONTACT_POSITION.x;
    const cdz = p.z - CONTACT_POSITION.z;
    const isContactNear = cdx * cdx + cdz * cdz < 56;
    if (isContactNear !== contactNear.current) {
      contactNear.current = isContactNear;
      onContactNear(isContactNear);
    }
  });

  const wheels = [
    { x: -0.82, z: -0.85, front: true },
    { x: 0.82, z: -0.85, front: true },
    { x: -0.82, z: 0.9, front: false },
    { x: 0.82, z: 0.9, front: false },
  ];

  return (
    <RigidBody
      ref={bodyRef}
      position={SPAWN_POSITION}
      colliders={false}
      enabledRotations={[false, true, false]}
      angularDamping={4}
    >
      <CuboidCollider args={[0.82, 0.45, 1.3]} position={[0, 0.45, 0]} />
      <mesh castShadow position={[0, 0.55, 0]}>
        <boxGeometry args={[1.5, 0.5, 2.6]} />
        <meshStandardMaterial color="#e0492e" roughness={0.55} />
      </mesh>
      <mesh castShadow position={[0, 1.0, 0.25]}>
        <boxGeometry args={[1.2, 0.5, 1.2]} />
        <meshStandardMaterial color="#f6f2e7" roughness={0.4} />
      </mesh>
      {[-0.45, 0.45].map((x) => (
        <mesh key={`head-${x}`} position={[x, 0.6, -1.31]}>
          <boxGeometry args={[0.22, 0.14, 0.06]} />
          <meshStandardMaterial
            color="#fff6cf"
            emissive="#ffe9a8"
            emissiveIntensity={1.4}
          />
        </mesh>
      ))}
      {[-0.5, 0.5].map((x) => (
        <mesh key={`tail-${x}`} position={[x, 0.58, 1.31]}>
          <boxGeometry args={[0.18, 0.12, 0.05]} />
          <meshStandardMaterial
            color="#ff8177"
            emissive="#ff5a4d"
            emissiveIntensity={0.9}
          />
        </mesh>
      ))}
      {wheels.map((wheel, i) => (
        <group
          key={i}
          position={[wheel.x, 0.34, wheel.z]}
          ref={(el) => {
            if (wheel.front) steerGroups.current[i] = el;
          }}
        >
          <group
            ref={(el) => {
              spinGroups.current[i] = el;
            }}
          >
            <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.34, 0.34, 0.28, 14]} />
              <meshStandardMaterial color="#2a2622" roughness={0.9} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.16, 0.16, 0.3, 10]} />
              <meshStandardMaterial color="#d9d2c0" roughness={0.6} />
            </mesh>
          </group>
        </group>
      ))}
    </RigidBody>
  );
};

const Exhibit = ({
  project,
  index,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
}) => {
  const { angle, position } = EXHIBIT_SPOTS[index];
  const texture = useTexture(project.image);
  const panel = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (panel.current) {
      panel.current.position.y =
        2.7 + Math.sin(clock.elapsedTime * 0.8 + index * 2) * 0.12;
    }
  });

  return (
    <group position={position} rotation={[0, -angle, 0]}>
      <mesh castShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.32, 0.45, 1, 12]} />
        <meshStandardMaterial color="#efeee8" roughness={0.8} />
      </mesh>

      <group ref={panel} position={[0, 2.7, 0]}>
        <mesh castShadow position={[0, 0, -0.05]}>
          <boxGeometry args={[3.14, 2.24, 0.09]} />
          <meshStandardMaterial color="#232120" roughness={0.5} />
        </mesh>
        <mesh>
          <planeGeometry args={[2.96, 2.06]} />
          <meshBasicMaterial
            map={texture}
            map-colorSpace={THREE.SRGBColorSpace}
            toneMapped={false}
          />
        </mesh>
        <Billboard position={[0, 1.45, 0]}>
          <Text fontSize={0.24} color="#232120" anchorX="center" maxWidth={4.5}>
            {`${String(index + 1).padStart(2, '0')} — ${project.title}`}
          </Text>
        </Billboard>
      </group>

      <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 0]}>
        <ringGeometry args={[1.7, 1.9, 48]} />
        <meshBasicMaterial color="#fbfaf3" transparent opacity={0.9} />
      </mesh>

      <CylinderCollider args={[1.5, 0.5]} position={[0, 1.5, 0]} />
    </group>
  );
};

const BOWLING_CENTER = { x: 24, z: -6 };
const BOWLING_PINS = Array.from({ length: 4 }, (_, row) =>
  Array.from({ length: row + 1 }, (_, i) => ({
    x: BOWLING_CENTER.x + row * 0.85,
    z: BOWLING_CENTER.z + (i - row / 2) * 0.82,
  })),
).flat();

const BowlingPins = () => (
  <>
    {BOWLING_PINS.map((pin, i) => (
      <RigidBody
        key={i}
        colliders="hull"
        position={[pin.x, 0, pin.z]}
        restitution={0.3}
        friction={0.6}
      >
        <mesh castShadow position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.11, 0.19, 0.84, 10]} />
          <meshStandardMaterial color="#f7f3e8" roughness={0.5} />
        </mesh>
        <mesh castShadow position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.1, 10]} />
          <meshStandardMaterial color="#d8432c" roughness={0.5} />
        </mesh>
        <mesh castShadow position={[0, 0.92, 0]}>
          <sphereGeometry args={[0.13, 12, 10]} />
          <meshStandardMaterial color="#f7f3e8" roughness={0.5} />
        </mesh>
      </RigidBody>
    ))}
  </>
);

const BRICKS = (() => {
  const bricks: { x: number; y: number; z: number }[] = [];
  for (let row = 0; row < 5; row++) {
    const offset = row % 2 === 0 ? 0 : 0.5;
    for (let col = 0; col < 5; col++) {
      bricks.push({
        x: -22,
        y: 0.17 + row * 0.35,
        z: -4 + (col - 2) * 1 + offset,
      });
    }
  }
  return bricks;
})();

const BrickWall = () => (
  <>
    {BRICKS.map((brick, i) => (
      <RigidBody
        key={i}
        colliders="cuboid"
        position={[brick.x, brick.y, brick.z]}
        friction={0.7}
      >
        <mesh castShadow>
          <boxGeometry args={[0.45, 0.33, 0.95]} />
          <meshStandardMaterial color="#c96f4a" roughness={0.75} />
        </mesh>
      </RigidBody>
    ))}
  </>
);

const CONES: [number, number][] = [
  [1.4, -9],
  [-1.3, -12],
  [1.1, -15],
  [-1.5, -18],
  [0.9, -21],
];

const TrafficCones = () => (
  <>
    {CONES.map(([x, z], i) => (
      <RigidBody key={i} colliders="hull" position={[x, 0, z]} friction={0.6}>
        <mesh castShadow position={[0, 0.36, 0]}>
          <coneGeometry args={[0.3, 0.68, 10]} />
          <meshStandardMaterial color="#e78a2e" roughness={0.6} />
        </mesh>
        <mesh castShadow position={[0, 0.04, 0]}>
          <boxGeometry args={[0.52, 0.08, 0.52]} />
          <meshStandardMaterial color="#d97c22" roughness={0.7} />
        </mesh>
      </RigidBody>
    ))}
  </>
);

const BeachBall = () => (
  <RigidBody
    colliders="ball"
    position={[14, 0.9, 3]}
    restitution={0.7}
    friction={0.4}
  >
    <mesh castShadow>
      <sphereGeometry args={[0.85, 24, 18]} />
      <meshStandardMaterial color="#3f6fbf" roughness={0.35} />
    </mesh>
  </RigidBody>
);

const DECORATIONS = (() => {
  let seed = 4242;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  return Array.from({ length: 54 }, () => {
    const angle = rand() * Math.PI * 2;
    const radius = 40 + rand() * 15;
    return {
      x: Math.sin(angle) * radius,
      z: Math.cos(angle) * radius,
      type: rand() < 0.72 ? 'tree' : 'rock',
      scale: 0.75 + rand() * 1.1,
      rotation: rand() * Math.PI * 2,
    };
  });
})();

const Decorations = () => (
  <>
    {DECORATIONS.map((item, i) => (
      <group
        key={i}
        position={[item.x, 0, item.z]}
        rotation={[0, item.rotation, 0]}
        scale={item.scale}
      >
        {item.type === 'tree' ? (
          <>
            <mesh castShadow position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.12, 0.18, 1, 6]} />
              <meshStandardMaterial color="#8a6a4f" flatShading />
            </mesh>
            <mesh castShadow position={[0, 1.6, 0]}>
              <coneGeometry args={[0.85, 2.3, 7]} />
              <meshStandardMaterial
                color={i % 3 === 0 ? '#597a4c' : '#6b8f5b'}
                flatShading
              />
            </mesh>
            <CylinderCollider args={[1.4, 0.5]} position={[0, 1.4, 0]} />
          </>
        ) : (
          <>
            <mesh castShadow position={[0, 0.25, 0]}>
              <dodecahedronGeometry args={[0.45, 0]} />
              <meshStandardMaterial color="#a8a294" flatShading />
            </mesh>
            <CylinderCollider args={[0.4, 0.5]} position={[0, 0.4, 0]} />
          </>
        )}
      </group>
    ))}
  </>
);

const ContactSign = () => (
  <group position={[CONTACT_POSITION.x, 0, CONTACT_POSITION.z]}>
    <mesh castShadow position={[0, 1, 0]}>
      <cylinderGeometry args={[0.09, 0.12, 2, 8]} />
      <meshStandardMaterial color="#8a6a4f" roughness={0.8} />
    </mesh>
    <group position={[0, 2.2, 0]} rotation={[0, Math.PI, 0]}>
      <mesh castShadow>
        <boxGeometry args={[3.4, 1.5, 0.12]} />
        <meshStandardMaterial color="#232120" roughness={0.5} />
      </mesh>
      <Text
        position={[0, 0.28, 0.08]}
        fontSize={0.42}
        color="#fafaf5"
        anchorX="center"
      >
        vamos conversar?
      </Text>
      <Text
        position={[0, -0.28, 0.08]}
        fontSize={0.2}
        color="#b9b4a5"
        anchorX="center"
      >
        chegue mais perto para ver o contato
      </Text>
    </group>
    <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 0]}>
      <ringGeometry args={[1.7, 1.9, 48]} />
      <meshBasicMaterial color="#fbfaf3" transparent opacity={0.9} />
    </mesh>
    <CylinderCollider args={[1.2, 0.35]} position={[0, 1.2, 0]} />
  </group>
);

const GroundMarks = () => (
  <>
    {/* Plaza + roads */}
    <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
      <circleGeometry args={[7, 48]} />
      <meshStandardMaterial color="#d9d3bd" />
    </mesh>
    <mesh rotation-x={-Math.PI / 2} position={[0, 0.008, -15]}>
      <planeGeometry args={[3, 26]} />
      <meshStandardMaterial color="#d9d3bd" />
    </mesh>
    <mesh rotation-x={-Math.PI / 2} position={[0, 0.008, 18]}>
      <planeGeometry args={[3, 22]} />
      <meshStandardMaterial color="#d9d3bd" />
    </mesh>
    <mesh
      rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      position={[15, 0.008, -2]}
    >
      <planeGeometry args={[3, 18]} />
      <meshStandardMaterial color="#d9d3bd" />
    </mesh>
    <mesh
      rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      position={[-15, 0.008, -2]}
    >
      <planeGeometry args={[3, 16]} />
      <meshStandardMaterial color="#d9d3bd" />
    </mesh>

    {/* Big ground name, Bruno Simon style */}
    <Text
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.03, -1]}
      fontSize={2.6}
      letterSpacing={0.04}
      color="#232120"
      anchorX="center"
      anchorY="middle"
    >
      john amorim
    </Text>
    <Text
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.03, 2.4]}
      fontSize={0.7}
      color="#6f6d66"
      anchorX="center"
      anchorY="middle"
    >
      produtos digitais · design · dados
    </Text>
    <Text
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.03, 16]}
      fontSize={0.55}
      color="#6f6d66"
      anchorX="center"
      anchorY="middle"
    >
      R para resetar · H para buzinar
    </Text>

    {/* Zone labels */}
    <Text
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.03, -22]}
      fontSize={1.3}
      color="#232120"
      anchorX="center"
    >
      projetos ↑
    </Text>
    <Text
      rotation={[-Math.PI / 2, 0, 0]}
      position={[19, 0.03, -1.5]}
      fontSize={1}
      color="#232120"
      anchorX="center"
    >
      strike!
    </Text>
    <Text
      rotation={[-Math.PI / 2, 0, 0]}
      position={[-16.5, 0.03, -1]}
      fontSize={1}
      color="#232120"
      anchorX="center"
    >
      crash test
    </Text>
    <Text
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.03, 24.5]}
      fontSize={1}
      color="#232120"
      anchorX="center"
    >
      contato ↓
    </Text>
  </>
);

const PlaygroundScene = ({
  playing,
  joystick,
  resetRef,
  onNear,
  onContactNear,
}: {
  playing: boolean;
  joystick: JoystickRef;
  resetRef: MutableRefObject<() => void>;
  onNear: (index: number) => void;
  onContactNear: (near: boolean) => void;
}) => (
  <>
    <color attach="background" args={['#eef0e4']} />
    <fog attach="fog" args={['#eef0e4', 42, 110]} />
    <hemisphereLight args={['#f2f6ff', '#c9c19b', 0.85]} />
    <directionalLight
      castShadow
      position={[26, 38, -14]}
      intensity={1.6}
      color="#fff4e0"
      shadow-mapSize={[2048, 2048]}
      shadow-camera-left={-60}
      shadow-camera-right={60}
      shadow-camera-top={60}
      shadow-camera-bottom={-60}
      shadow-camera-near={5}
      shadow-camera-far={130}
      shadow-bias={-0.0004}
    />

    <Suspense fallback={null}>
      <Physics paused={!playing}>
        {/* Ground */}
        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <circleGeometry args={[78, 64]} />
          <meshStandardMaterial color="#e3ddca" />
        </mesh>
        <CuboidCollider args={[70, 0.5, 70]} position={[0, -0.5, 0]} />

        {/* Invisible boundary walls */}
        <CuboidCollider
          args={[WORLD_HALF, 4, 1]}
          position={[0, 2, -WORLD_HALF]}
        />
        <CuboidCollider
          args={[WORLD_HALF, 4, 1]}
          position={[0, 2, WORLD_HALF]}
        />
        <CuboidCollider
          args={[1, 4, WORLD_HALF]}
          position={[-WORLD_HALF, 2, 0]}
        />
        <CuboidCollider
          args={[1, 4, WORLD_HALF]}
          position={[WORLD_HALF, 2, 0]}
        />

        <GroundMarks />
        <Decorations />
        <BowlingPins />
        <BrickWall />
        <TrafficCones />
        <BeachBall />
        <ContactSign />

        {PROJECTS.map((project, i) => (
          <Exhibit key={project.title} project={project} index={i} />
        ))}

        <CarRig
          enabled={playing}
          joystick={joystick}
          resetRef={resetRef}
          onNear={onNear}
          onContactNear={onContactNear}
        />
      </Physics>
    </Suspense>
  </>
);

const JOY_RADIUS = 44;

const Joystick = ({ inputRef }: { inputRef: JoystickRef }) => {
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const base = useRef<HTMLDivElement>(null);
  const pointerId = useRef<number | null>(null);

  const update = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = base.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    let dx = e.clientX - (rect.left + rect.width / 2);
    let dy = e.clientY - (rect.top + rect.height / 2);
    const len = Math.hypot(dx, dy);
    if (len > JOY_RADIUS) {
      dx = (dx / len) * JOY_RADIUS;
      dy = (dy / len) * JOY_RADIUS;
    }
    setKnob({ x: dx, y: dy });
    inputRef.current.x = dx / JOY_RADIUS;
    inputRef.current.y = -dy / JOY_RADIUS;
  };

  const release = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerId.current !== e.pointerId) return;
    pointerId.current = null;
    setKnob({ x: 0, y: 0 });
    inputRef.current.x = 0;
    inputRef.current.y = 0;
  };

  return (
    <div
      ref={base}
      className="absolute bottom-8 left-6 h-32 w-32 touch-none rounded-full border-2 border-ink/25 bg-cream/50 backdrop-blur"
      onPointerDown={(e) => {
        pointerId.current = e.pointerId;
        e.currentTarget.setPointerCapture(e.pointerId);
        update(e);
      }}
      onPointerMove={(e) => {
        if (pointerId.current === e.pointerId) update(e);
      }}
      onPointerUp={release}
      onPointerCancel={release}
    >
      <div
        className="absolute left-1/2 top-1/2 h-14 w-14 rounded-full bg-ink/70 shadow-lg"
        style={{
          transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))`,
        }}
      />
    </div>
  );
};

const PlaygroundPage = () => {
  const [playing, setPlaying] = useState(false);
  const [near, setNear] = useState(-1);
  const [contactNear, setContactNear] = useState(false);
  const { active } = useProgress();
  const joystick = useRef({ x: 0, y: 0 });
  const resetRef = useRef<() => void>(() => {});
  const audioCtx = useRef<AudioContext | null>(null);
  const isTouch = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches,
    [],
  );

  useEffect(() => {
    document.title = 'john amorim — playground 3d';
  }, []);

  const honk = useCallback(() => {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return;
    if (!audioCtx.current) audioCtx.current = new Ctor();
    const ctx = audioCtx.current;
    if (ctx.state === 'suspended') void ctx.resume();
    const now = ctx.currentTime;
    for (const freq of [392, 494]) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.02);
      gain.gain.setValueAtTime(0.06, now + 0.18);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    }
  }, []);

  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.code === 'KeyR') resetRef.current();
      if (e.code === 'KeyH') honk();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [playing, honk]);

  const nearProject = near >= 0 ? PROJECTS[near] : null;

  return (
    <div className="fixed inset-0 touch-none overflow-hidden bg-[#eef0e4] font-grotesk text-ink">
      <Canvas shadows camera={{ position: [0, 16, 30], fov: 45 }} dpr={[1, 1.5]}>
        <PlaygroundScene
          playing={playing}
          joystick={joystick}
          resetRef={resetRef}
          onNear={setNear}
          onContactNear={setContactNear}
        />
      </Canvas>

      {/* HUD hint */}
      {playing && (
        <div className="pointer-events-none absolute left-1/2 top-5 -translate-x-1/2 rounded-full bg-ink/70 px-4 py-1.5 text-center text-xs text-cream">
          {isTouch
            ? 'use o joystick para dirigir'
            : 'WASD ou setas para dirigir · R para resetar · H para buzinar'}
        </div>
      )}

      {/* Back link + exit */}
      {playing && (
        <>
          <a
            href="/"
            className="absolute left-5 top-5 rounded-full bg-cream/80 px-4 py-1.5 text-xs backdrop-blur transition-colors hover:bg-cream"
          >
            ← voltar ao site
          </a>
          <button
            onClick={() => setPlaying(false)}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-ink/70 text-cream transition-opacity hover:opacity-80"
            aria-label="Pausar exploração"
          >
            ✕
          </button>
        </>
      )}

      {/* Proximity project card */}
      {playing && nearProject && !contactNear && (
        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center px-5">
          <div className="max-w-md rounded-xl bg-cream/95 p-5 text-center shadow-xl backdrop-blur">
            <p className="text-xs uppercase tracking-wide text-stone-soft">
              {String(near + 1).padStart(2, '0')} — {nearProject.client} ·{' '}
              {nearProject.category}
            </p>
            <h2 className="mt-1 text-xl font-medium leading-tight">
              {nearProject.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-soft">
              {nearProject.description}
            </p>
          </div>
        </div>
      )}

      {/* Contact card */}
      {playing && contactNear && (
        <div className="absolute inset-x-0 bottom-6 flex justify-center px-5">
          <div className="pointer-events-auto max-w-md rounded-xl bg-cream/95 p-5 text-center shadow-xl backdrop-blur">
            <p className="text-xs uppercase tracking-wide text-stone-soft">
              contato
            </p>
            <h2 className="mt-1 text-xl font-medium leading-tight">
              Vamos construir algo juntos?
            </h2>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-2 inline-block text-sm underline decoration-1 underline-offset-4 hover:opacity-60"
            >
              {CONTACT_EMAIL}
            </a>
            <div className="mt-3 flex justify-center gap-4 text-sm">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-4 hover:underline"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Touch controls */}
      {playing && isTouch && (
        <>
          <Joystick inputRef={joystick} />
          <div className="absolute bottom-8 right-6 flex flex-col gap-3">
            <button
              onClick={honk}
              className="h-16 w-16 select-none rounded-full border-2 border-ink/30 bg-cream/80 text-xs font-medium backdrop-blur active:bg-ink active:text-cream"
            >
              buzina
            </button>
            <button
              onClick={() => resetRef.current()}
              className="h-16 w-16 select-none rounded-full border-2 border-ink/30 bg-cream/80 text-xs font-medium backdrop-blur active:bg-ink active:text-cream"
            >
              resetar
            </button>
          </div>
        </>
      )}

      {/* Start screen */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center bg-ink/40 p-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-cream p-8 text-center shadow-2xl">
            <p className="text-xs uppercase tracking-wide text-stone-soft">
              playground 3d
            </p>
            <h1 className="mt-2 text-3xl font-medium tracking-tight">
              Dirija pelo meu portfólio
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-stone-soft">
              {isTouch
                ? 'Use o joystick para dirigir o carrinho. Visite os totens dos projetos, derrube os pinos de boliche e o muro de tijolos.'
                : 'Use WASD (ou setas) para dirigir o carrinho. Visite os totens dos projetos, derrube os pinos de boliche e o muro de tijolos.'}
            </p>
            <button
              onClick={() => setPlaying(true)}
              disabled={active}
              className="mt-6 w-full rounded-full bg-ink px-6 py-3 font-medium text-cream transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {active ? 'carregando mundo…' : 'Começar a dirigir →'}
            </button>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-stone-soft">
              <a
                href="/"
                className="underline-offset-4 hover:text-ink hover:underline"
              >
                ← voltar ao site
              </a>
              {VERSIONS.filter(
                (v) => v.path !== '/playground' && v.path !== '/',
              ).map((version) => (
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

export default PlaygroundPage;
