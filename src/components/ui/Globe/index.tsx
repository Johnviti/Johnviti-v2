import createGlobe from "cobe";
import { useEffect, useRef } from "react";

export const Globe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let phi = 0;
    let globe: any;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      globe?.destroy();

      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: rect.width * dpr,
        height: rect.height * dpr,
        phi: 0,
        theta: 0,
        dark: 1,
        diffuse: 1.4,
        mapSamples: 16000,
        mapBrightness: 8,
        baseColor: [0.1, 0.1, 0.1],
        markerColor: [0, 0.7, 1],
        glowColor: [0, 0.7, 1],
        markers: [{ location: [-23.5505, -46.6333], size: 0.1 }],
        onRender: (state) => {
          state.phi = phi;
          phi += 0.003;
        },
      });
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    return () => {
      globe?.destroy();
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-[150vmin] h-[130vmin]"
    />
  );
};

export default Globe;