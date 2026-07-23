/**
 * Labels exibidos pelo pré-loader e pelo loader de transição para cada rota.
 * Novas rotas caem no fallback "PORTFÓLIO" até ganharem um label próprio.
 */
export const labelForPath = (pathname: string): string => {
  const path = pathname.replace(/\/+$/, '') || '/';
  // A galeria imersiva é a home; '/galeria-imersiva' segue como alias antigo.
  if (path === '/' || path === '/galeria-imersiva') return 'GALERIA IMERSIVA';
  if (path === '/minimal') return 'MINIMAL';
  if (path === '/mundo') return 'MUNDO';
  if (path === '/playground') return 'PLAYGROUND';
  if (path === '/oryzo') return 'ORYZO';
  if (path.startsWith('/case/')) return 'CASE STUDY';
  // Rota desativada — reative junto com a de App.tsx.
  // if (path === '/cinetica') return 'CINÉTICA';
  return 'PORTFÓLIO';
};
