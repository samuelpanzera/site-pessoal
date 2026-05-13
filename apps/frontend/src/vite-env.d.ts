/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LAST_UPDATED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
