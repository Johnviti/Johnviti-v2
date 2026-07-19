import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { CONTACT_EMAIL, PROJECTS, VERSIONS } from '@/data/site';

const TILE_COUNT = 36;

const MosaicTile = ({
  project,
  index,
  onSelect,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
  onSelect: () => void;
}) => {
  const tile = useRef<HTMLButtonElement>(null);
  const isWide = index % 11 === 2 || index % 13 === 4;
  const isTall = index % 9 === 0;

  const move = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.transform = `perspective(650px) translateZ(75px) scale(1.13) rotateX(${-y * 11}deg) rotateY(${x * 12}deg)`;
    event.currentTarget.style.zIndex = '20';
  };

  const reset = () => {
    if (!tile.current) return;
    tile.current.style.transform = '';
    tile.current.style.zIndex = '';
  };

  return (
    <button
      ref={tile}
      type="button"
      onClick={onSelect}
      onPointerMove={move}
      onPointerLeave={reset}
      aria-label={`Ver projeto ${project.title}`}
      className={`group relative min-h-24 overflow-hidden border border-white/[0.035] bg-[#111] text-left shadow-[0_18px_50px_rgba(0,0,0,.45)] transition-[transform,filter] duration-300 ease-out will-change-transform ${
        isWide ? 'col-span-2' : ''
      } ${isTall ? 'row-span-2' : ''}`}
    >
      <img
        src={project.image}
        alt=""
        className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
          index % 4 === 0 ? 'grayscale' : ''
        } ${index % 5 === 0 ? 'saturate-150 contrast-125' : ''}`}
        draggable={false}
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="absolute inset-x-0 bottom-0 translate-y-3 p-3 text-[9px] uppercase tracking-[0.12em] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        {project.title}
      </span>
    </button>
  );
};

const MosaicPage = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const tiles = useMemo(
    () =>
      Array.from({ length: TILE_COUNT }, (_, index) => ({
        project: PROJECTS[(index * 3 + Math.floor(index / 5)) % PROJECTS.length],
        index,
      })),
    [],
  );

  useEffect(() => {
    document.title = 'john amorim — mosaico';
  }, []);

  useEffect(() => {
    if (selected === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
      if (event.key === 'ArrowRight') {
        setSelected((current) =>
          current === null ? 0 : (current + 1) % PROJECTS.length,
        );
      }
      if (event.key === 'ArrowLeft') {
        setSelected((current) =>
          current === null
            ? 0
            : (current - 1 + PROJECTS.length) % PROJECTS.length,
        );
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  const moveLens = (event: ReactPointerEvent<HTMLDivElement>) => {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    if (grid.current) {
      grid.current.style.transform = `perspective(1000px) rotateX(${-y * 3.5}deg) rotateY(${x * 4}deg) translate3d(${-x * 14}px, ${-y * 12}px, 0) scale(1.055)`;
    }
    if (cursor.current) {
      cursor.current.style.transform = `translate3d(${event.clientX - 18}px, ${event.clientY - 18}px, 0)`;
    }
  };

  const project = selected === null ? null : PROJECTS[selected];

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-black font-grotesk text-white"
      onPointerMove={moveLens}
    >
      <div
        ref={grid}
        className="absolute -inset-[6vh_3vw] grid grid-cols-4 auto-rows-[clamp(92px,16vh,150px)] gap-3 transition-transform duration-150 ease-out will-change-transform sm:grid-cols-6 md:grid-cols-8 md:gap-4"
      >
        {tiles.map(({ project: tileProject, index }) => {
          const projectIndex = PROJECTS.indexOf(tileProject);
          return (
            <MosaicTile
              key={`${tileProject.title}-${index}`}
              project={tileProject}
              index={index}
              onSelect={() => setSelected(projectIndex)}
            />
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_28%,rgba(0,0,0,.4)_72%,rgba(0,0,0,.9)_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background:repeating-linear-gradient(0deg,transparent,transparent_3px,#fff_4px)]" />

      <header className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 text-[10px] uppercase tracking-[0.1em] md:p-6">
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
            onClick={() => setSelected(0)}
            className="uppercase tracking-[0.1em] transition-opacity hover:opacity-50"
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
            href="/orbita"
            aria-label="Abrir versão órbita"
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[12px] text-black transition-transform hover:rotate-90"
          >
            +
          </a>
        </nav>
      </header>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-[10px] uppercase tracking-[0.12em] md:p-6">
        <p className="max-w-[17rem] leading-relaxed text-white/65">
          Mova o cursor para deformar a galeria · selecione um projeto
        </p>
        <div className="pointer-events-auto hidden items-center gap-3 text-white/50 md:flex">
          {VERSIONS.filter((version) =>
            ['/', '/minimal', '/orbita'].includes(version.path),
          ).map((version) => (
            <a
              key={version.path}
              href={version.path}
              className="transition-colors hover:text-white"
            >
              {version.label}
            </a>
          ))}
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>

      <div
        ref={cursor}
        className="pointer-events-none fixed left-0 top-0 hidden h-9 w-9 rounded-full border border-white/70 mix-blend-difference will-change-transform md:block"
      />

      {project && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center bg-black/75 p-5 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mosaic-project-title"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative grid max-h-[90svh] w-full max-w-5xl overflow-hidden border border-white/15 bg-[#090909] shadow-2xl md:grid-cols-[1.45fr_1fr]"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={project.image}
              alt={`Prévia do projeto ${project.title}`}
              className="h-full min-h-60 w-full object-cover"
            />
            <div className="flex flex-col justify-between p-6 md:p-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-white/45">
                  {project.client} · {project.category}
                </p>
                <h1
                  id="mosaic-project-title"
                  className="mt-3 text-2xl font-medium leading-tight tracking-tight md:text-4xl"
                >
                  {project.title}
                </h1>
                <p className="mt-5 text-sm leading-relaxed text-white/55">
                  {project.description}
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-white/45">
                <span>
                  {String((selected ?? 0) + 1).padStart(2, '0')} /{' '}
                  {String(PROJECTS.length).padStart(2, '0')}
                </span>
                <span>← → para navegar</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Fechar projeto"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-sm backdrop-blur transition-colors hover:bg-white hover:text-black"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MosaicPage;
