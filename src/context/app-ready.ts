import { createContext, useContext } from 'react';

// true quando o preloader terminou e o site pode animar sua entrada
export const AppReadyContext = createContext(false);

export function useAppReady() {
  return useContext(AppReadyContext);
}
