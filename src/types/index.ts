export interface MoveMouseParams {
  left: number
  top: number
  isDraging: boolean
}

export interface ScrollMouseParams {
  right?: number
  top?: number
}

export interface MouseClickParams {
  /** Accepts left, right, or middle. */
  button?: 'left' | 'right' | 'middle'
  /** Set to true to perform a double click.	 */
  double?: boolean
}

export interface KeyTapParams {
  key: string
  modified?: string[]
}

export interface PreloadAPITypes {
  moveMouseSmooth: (left: number, top: number) => void
  scrollMouse: ({ right, top }: ScrollMouseParams) => void
  mouseClick: ({ button, double }: MouseClickParams) => void
  keyTap: ({ key, modified }: KeyTapParams) => void
  zoomInOrOut: (isIn?: boolean) => void
  getWiFiIPAddress(): Promise<string>
}

export interface AppleScript {
  execString(script: string, callback?: (err: unknown, rtn: unknown) => void): void
  execFile(script: string, callback?: (err: unknown, rtn: unknown) => void): void
}
