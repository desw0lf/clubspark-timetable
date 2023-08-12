/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TITLE: string;
  readonly VITE_BASE_API: string;
  readonly VITE_DEFAULT_CLUBSPARK_ID_LIST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}