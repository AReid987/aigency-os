/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PAPERCLIP_URL?: string;
  readonly VITE_DENCHCLAW_URL?: string;
  readonly VITE_HCOM_URL?: string;
  readonly VITE_GBRAIN_URL?: string;
  readonly VITE_AEGIS_URL?: string;
  readonly VITE_PLANNOTATOR_URL?: string;
  readonly VITE_SKILLS_URL?: string;
  readonly VITE_WTERM_URL?: string;
  readonly VITE_API_URL?: string;
  readonly VITE_WS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
