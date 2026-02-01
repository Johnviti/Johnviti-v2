import { useRef, useEffect } from 'react';
import { MotionValue } from 'framer-motion';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
    size: number;
}

interface NeonTrailProps {
    mouseX: MotionValue<number>;
    mouseY: MotionValue<number>;
}

export const NeonTrail = ({ mouseX, mouseY }: NeonTrailProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<Particle[]>([]);
    const animationFrameId = useRef<number | null>(null);
    const lastMousePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const createParticle = (x: number, y: number) => {
            const colors = ['#3b82f6']; // Only Blue
            const color = colors[Math.floor(Math.random() * colors.length)];

            particles.current.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 0.2, // Minimized scatter for tight trail
                vy: (Math.random() - 0.5) * 0.2,
                life: 1,
                color,
                size: Math.random() * 4 + 2 // Slightly larger for better glow
            });
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Interpolate mouse position for smooth trail
            const currentX = mouseX.get();
            const currentY = mouseY.get();
            const dx = currentX - lastMousePos.current.x;
            const dy = currentY - lastMousePos.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 0) {
                // Create particles along the path
                const steps = Math.min(dist, 40); // Increased density
                for (let i = 0; i < steps; i++) {
                    createParticle(
                        lastMousePos.current.x + (dx * i) / steps,
                        lastMousePos.current.y + (dy * i) / steps
                    );
                }
            }

            lastMousePos.current = { x: currentX, y: currentY };

            // Update and draw particles
            particles.current.forEach((p, index) => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.015; // Slower fade for longer trail

                if (p.life <= 0) {
                    particles.current.splice(index, 1);
                    return;
                }

                ctx.beginPath();
                ctx.globalCompositeOperation = 'lighter';
                ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                // Add glow effect
                ctx.shadowBlur = 20;
                ctx.shadowColor = p.color;
                ctx.globalAlpha = p.life;
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.globalAlpha = 1;
            });

            animationFrameId.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [mouseX, mouseY]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-0"
        />
    );
};
