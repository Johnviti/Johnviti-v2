import { useRef, Suspense, useEffect } from 'react';
import { useGLTF, Environment, Float, ContactShadows, OrbitControls, Bounds } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useControls, folder } from 'leva';

import headsetModelUrl from '@/assets/3d/headset_sog_h70.glb';

const Model = ({
    autoRotate,
    wireframe,
    wireframeAngle = 5,
    wireframeMode = 'edges',
    scale = 0.5
}: {
    autoRotate: boolean,
    wireframe: boolean,
    wireframeAngle?: number,
    wireframeMode?: 'edges' | 'topology',
    scale?: number
}) => {
    const group = useRef<THREE.Group>(null);
    const { scene } = useGLTF(headsetModelUrl);

    useEffect(() => {
        const addedEdges: THREE.LineSegments[] = [];

        scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
                if (wireframe) {
                    // Esconde a malha principal
                    child.material.visible = false;

                    // Usa EdgesGeometry para as quinas ou WireframeGeometry para todos os triângulos (topologia bruta)
                    const edges = wireframeMode === 'edges' 
                        ? new THREE.EdgesGeometry(child.geometry, wireframeAngle) 
                        : new THREE.WireframeGeometry(child.geometry);
                        
                    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 }));  // Baixei a opacidade para 30% pra não doer o olho na topologia completa
                    
                    child.add(line);
                    addedEdges.push(line);
                } else {
                    // Restaura a visibilidade da malha normal
                    child.material.visible = true;
                    child.material.wireframe = false;
                }
            }
        });

        // Cleanup: remove as linhas quando desligar o wireframe ou mudar o modo/ângulo
        return () => {
            addedEdges.forEach(line => {
                if (line.parent) line.parent.remove(line);
                line.geometry.dispose();
                (line.material as THREE.Material).dispose();
            });
        };
    }, [scene, wireframe, wireframeAngle, wireframeMode]);

    useFrame((state) => {
        if (group.current) {
            if (autoRotate) {
                // Rotação contínua (360 graus) ao invés de apenas oscilar
                const t = state.clock.getElapsedTime();
                group.current.rotation.y = Math.PI + (t * 0.3); 
                // Apenas um levíssimo movimento em X para dar fluidez
                group.current.rotation.x = Math.cos(t / 2) * 0.05 + 0.1;
            } else {
                group.current.rotation.y = 0;
                group.current.rotation.x = 0;
            }
        }
    });

    return (
        <group ref={group} dispose={null}>
            <primitive object={scene} scale={scale} />
        </group>
    );
};

export const Headset3D = ({ className }: { className?: string }) => {
    return (
        // Removido o 'pointer-events-none' para habilitar a interação do mouse e adicionado cursor-grab
        <div className={className || "absolute top-[-80px] right-[20%] w-[400px] h-[400px] z-50 cursor-grab active:cursor-grabbing xl:right-[25%] 2xl:right-[20%]"}>
            <Canvas camera={{ position: [0, 0, 10], fov: 15 }}>
                <OrbitControls enableZoom={false} enablePan={false} />
                <ambientLight intensity={0.3} color="#2b2baa" />
                <directionalLight 
                    position={[5, 5, 5]} 
                    intensity={2.5} 
                    color="#000c7a" 
                />

                <Suspense fallback={null}>
                    <Bounds fit clip observe margin={1.2}>
                        <Float
                            speed={2}
                            rotationIntensity={0.5}
                            floatIntensity={1}
                        >
                            <Model autoRotate={false} wireframe={true} scale={1} />
                        </Float>
                    </Bounds>

                    <ContactShadows 
                        position={[0, -2, 0]} 
                        opacity={0.5} 
                        scale={10} 
                        blur={2} 
                        far={4} 
                        color="#000000" 
                    />

                    <Environment preset="studio" />
                </Suspense>
            </Canvas>
        </div>
    );
};

export const Headset3DConfigurator = ({ className }: { className?: string }) => {
    // Generate Leva Controls Panel
    const displayControls = useControls({
        Display: folder({
            background: true,
            autoRotate: true,
            wireframe: false,
            wireframeMode: { value: 'edges', options: ['edges', 'topology'] },
            wireframeAngle: { value: 5, min: 0, max: 90, step: 1 }, 
            scale: { value: 1, min: 0.1, max: 2, step: 0.05 } 
        }),
        Lighting: folder({
            environment: { value: 'studio', options: ['apartment', 'city', 'dawn', 'forest', 'lobby', 'night', 'park', 'studio', 'sunset', 'warehouse'] },
            punctualLights: true,
            ambientIntensity: { value: 0.3, min: 0, max: 2, step: 0.05 },
            ambientColor: '#2b2baa',
            directIntensity: { value: 2.5, min: 0, max: 5, step: 0.1 },
            directColor: '#000c7a',
            directPos: { value: [5, 5, 5], step: 0.5 }
        })
    });

    return (
        <div style={{ backgroundColor: displayControls.background ? '#191919' : 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center' }} className={className || "w-full h-full"}>
            <div className="w-full h-full max-w-[800px] max-h-[800px]">
                <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                    <OrbitControls makeDefault enableZoom={true} enablePan={false} />
                    
                    {displayControls.punctualLights && (
                        <>
                            <ambientLight intensity={displayControls.ambientIntensity} color={displayControls.ambientColor} />
                            <directionalLight 
                                position={displayControls.directPos as [number, number, number]} 
                                intensity={displayControls.directIntensity} 
                                color={displayControls.directColor} 
                            />
                        </>
                    )}

                    <Suspense fallback={null}>
                        <Bounds fit clip observe margin={1.2}>
                            <Float
                                speed={2}
                                rotationIntensity={0.5}
                                floatIntensity={1}
                            >
                                <Model autoRotate={displayControls.autoRotate} wireframe={displayControls.wireframe} wireframeMode={displayControls.wireframeMode as 'edges' | 'topology'} wireframeAngle={displayControls.wireframeAngle} scale={displayControls.scale} />
                            </Float>
                        </Bounds>

                        <ContactShadows 
                            position={[0, -2, 0]} 
                            opacity={0.5} 
                            scale={10} 
                            blur={2} 
                            far={4} 
                            color="#000000" 
                        />

                        <Environment preset={displayControls.environment as any} />
                    </Suspense>
                </Canvas>
            </div>
        </div>
    );
};

useGLTF.preload(headsetModelUrl);
