/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  VITE_FIREBASE_API_KEY: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
