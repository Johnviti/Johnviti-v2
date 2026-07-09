// Grid blueprint persistente — mesmas posições das linhas do preloader,
// para que a transição preloader → site pareça contínua.
export const GRID_COLUMNS = 12;

export function GridLines() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      {Array.from({ length: GRID_COLUMNS - 1 }, (_, i) => (
        <div
          key={i}
          className="absolute inset-y-0 w-px bg-line-faint"
          style={{ left: `${((i + 1) / GRID_COLUMNS) * 100}%` }}
        />
      ))}
    </div>
  );
}
