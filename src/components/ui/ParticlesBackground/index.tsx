import { useCallback } from "react";
import type { Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export const ParticlesBackground = () => {
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine);
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
                background: {
                    color: {
                        value: "transparent",
                    },
                },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onHover: {
                            enable: false, // Desliga interatividade
                        },
                        resize: true,
                    },
                },
                particles: {
                    color: {
                        value: "#008cff46", // Cor branca para as estrelas
                    },
                    links: {
                        enable: false, // Remove as linhas de constelação (nodes)
                    },
                    collisions: {
                        enable: false,
                    },
                    move: {
                        direction: "top", // Sobe lentamente como poeira estrelar (opcional, ou 'none' para flutuar)
                        enable: true,
                        outModes: {
                            default: "out",
                        },
                        random: true,
                        speed: 0.3, // Super lento
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 120, // Dobro da quantidade de pontinhos
                    },
                    opacity: {
                        value: { min: 0.05, max: 0.2 }, // Opacidade ainda mais baixa
                        animation: {
                            enable: true,
                            speed: 0.8,
                            minimumValue: 0.05,
                            sync: false,
                        },
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 0.5, max: 2 }, // Pontinhos bem minúsculos e orgânicos
                    },
                },
                detectRetina: true,
            }}
            className="absolute inset-0 z-0 pointer-events-none"
        />
    );
};

export default ParticlesBackground;
