declare module 'granim' {
  interface GranimOptions {
    element: HTMLCanvasElement | string
    direction?: 'diagonal' | 'left-right' | 'top-bottom' | 'radial'
    isPausedWhenNotInView?: boolean
    states: {
      [key: string]: {
        gradients: string[][]
        transitionSpeed?: number
      }
    }
  }

  export default class Granim {
    constructor(options: GranimOptions)
    play(): void
    pause(): void
    clear(): void
    changeState(stateName: string): void
  }
}