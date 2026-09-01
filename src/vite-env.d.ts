/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Chave pública do Web3Forms — ver `.env.example`. */
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string;
  /** `'true'` libera a rota local `/revisao` — ver `.env.example`. */
  readonly VITE_CASES_EDITOR?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
