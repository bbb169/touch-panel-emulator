export interface MoveMouseParams {
  left: number
  top: number
}

export interface ScrollMouseParams {
  right?: number
  top?: number
}

export interface PreloadAPITypes {
  moveMouseSmooth: (left: number, top: number) => void
  scrollMouse: ({ right, top }: ScrollMouseParams) => void
}

export interface AppleScript {
  execString(script: string, callback?: (err: unknown, rtn: unknown) => void): void
  execFile(script: string, callback?: (err: unknown, rtn: unknown) => void): void
}
