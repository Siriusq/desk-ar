// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': unknown
  }
}

declare global {
  interface HTMLModelViewerElement extends HTMLElement {
    activateAR: () => void
    canActivateAR: boolean
  }
}

export {}
