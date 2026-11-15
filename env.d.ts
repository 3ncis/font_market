/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent
  export default component
}

interface GoogleCredentialResponse {
  credential: string
}

interface GoogleButtonOptions {
  theme?: 'outline'
  size?: 'large'
  text?: 'continue_with'
  width?: number
}

interface Window {
  google?: {
    accounts: {
      id: {
        initialize(options: {
          client_id: string
          callback: (response: GoogleCredentialResponse) => void
        }): void
        renderButton(parent: HTMLElement, options: GoogleButtonOptions): void
      }
    }
  }
}
