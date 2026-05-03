/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'ownerApp/OwnerApp' {
  import type { ComponentType } from 'react'
  const OwnerApp: ComponentType
  export default OwnerApp
}

declare module 'adminApp/AdminApp' {
  import type { ComponentType } from 'react'
  const AdminApp: ComponentType
  export default AdminApp
}
