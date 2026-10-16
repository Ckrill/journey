/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  readonly VITE_CONTENTFUL_ACCESS_TOKEN: string;
  readonly VITE_CONTENTFUL_ACCESS_TOKEN_MANAGEMENT: string;
  readonly VITE_CONTENTFUL_SPACE_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
