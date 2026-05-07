/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AI_SERVICE_URL: string
  readonly VITE_AI_SERVICE_API_KEY?: string
  readonly VITE_AI_SERVICE_TIMEOUT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
