/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME?: string;
  // readonly VITE_FEATURE_X?: string; // exemple
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
