import { useEffect, useRef } from 'react';

export const GlowingCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const amount = 20;
    // Inicializa no meio da tela
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dots: { x: number; y: number; scale: number; element: HTMLSpanElement }[] = [];

    for (let i = 0; i < amount; i++) {
      const element = document.createElement("span");
      const scale = 1 - 0.05 * i;

      element.style.position = "absolute";
      element.style.width = "26px";
      element.style.height = "26px";
      element.style.borderRadius = "50%";
      element.style.background = "#00B2FF"; // A cor do cursor solicitada
      element.style.transformOrigin = "center center";

      cursor.appendChild(element);
      dots.push({ x: mouse.x, y: mouse.y, scale, element });
    }

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);

    let animationFrameId: number;

    const render = () => {
      let x = mouse.x;
      let y = mouse.y;

      dots.forEach((dot, index) => {
        dot.x = x;
        dot.y = y;

        // Aplica tradução baseada na pos x e y. O -13 centraliza a bolinha de 26px
        dot.element.style.transform = `translate(${dot.x - 13}px, ${dot.y - 13}px) scale(${dot.scale})`;

        const nextDot = dots[index + 1] || dots[0];
        x += (nextDot.x - dot.x) * 0.35;
        y += (nextDot.y - dot.y) * 0.35;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      cancelAnimationFrame(animationFrameId);
      if (cursor) {
        cursor.innerHTML = '';
      }
    };
  }, []);

  return (
    <>
      {/* SVG filter (necessário para efeito goo) */}
      <svg xmlns="http://www.w3.org/2000/svg" style={{ position: 'fixed', width: 0, height: 0 }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  
                      0 1 0 0 0  
                      0 0 1 0 0  
                      0 0 0 35 -15"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Cursor container com o filtro CSS */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{ filter: 'url("#goo")' }}
      ></div>

      {/* Esconde cursor padrão nas telas que possuem mouse */}
      <style>
        {`
          @media (pointer: fine) {
            body {
              cursor: none !important;
            }
          }
        `}
      </style>
    </>
  );
};
