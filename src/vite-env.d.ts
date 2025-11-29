/// <reference types="vite/client" />

// Si quieres declarar otras variables personalizadas:
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_CLOUDINARY_CLOUD_NAME: string
  readonly VITE_CLOUDINARY_UPLOAD_PRESET: string
  // agrega más si necesitas...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
