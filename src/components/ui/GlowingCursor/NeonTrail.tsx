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
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                life: 1,
                color,
                size: Math.random() * 4 + 2
            });
        };

        const animate = () => {
            // Use a slight fade effect for the trail instead of full clear, enables smoother visuals with fewer particles
            // But if transparent background is needed, we must clear.
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Keep clearRect for clean background

            // Interpolate mouse position for smooth trail
            const currentX = mouseX.get();
            const currentY = mouseY.get();
            const dx = currentX - lastMousePos.current.x;
            const dy = currentY - lastMousePos.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 0) {
                // Create particles along the path
                // Reduce limit from 40 to 10 to save CPU
                const steps = Math.min(dist, 10);
                for (let i = 0; i < steps; i++) {
                    createParticle(
                        lastMousePos.current.x + (dx * i) / steps,
                        lastMousePos.current.y + (dy * i) / steps
                    );
                }
            }

            lastMousePos.current = { x: currentX, y: currentY };

            // Update and draw particles
            // Iterate backwards to allow safe removal
            ctx.globalCompositeOperation = 'lighter';

            for (let i = particles.current.length - 1; i >= 0; i--) {
                const p = particles.current[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.02; // Slightly faster fade

                if (p.life <= 0) {
                    particles.current.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                // Radial gradient is faster than shadowBlur for glow
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * p.life * 2);
                gradient.addColorStop(0, `rgba(59, 130, 246, ${p.life})`);
                gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

                ctx.fillStyle = gradient;
                ctx.arc(p.x, p.y, p.size * p.life * 2, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.globalCompositeOperation = 'source-over'; // Reset
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
