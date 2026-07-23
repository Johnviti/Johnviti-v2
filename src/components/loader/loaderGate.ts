/**
 * Ponto de sincronização entre o Preloader e as páginas.
 *
 * Quem precisa esperar o véu sair (ex.: overlay de instruções da galeria
 * imersiva, coreografias de entrada) aguarda `preloaderDone` em vez de
 * adivinhar o timing — o Preloader resolve a promise ao desmontar.
 */
let resolveDone: (() => void) | undefined;
let settled = false;

export const preloaderDone = new Promise<void>((resolve) => {
  resolveDone = resolve;
});

export const markPreloaderDone = () => {
  if (settled) return;
  settled = true;
  resolveDone?.();
};
