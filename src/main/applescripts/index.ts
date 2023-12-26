const keyCodeMap = {
  left: 123,
  right: 124,
  top: 126,
  add: 24,
  minus: 27
}

export const threeFingerSwitchWindow = (direction: keyof typeof keyCodeMap): string => {
  return `tell application "System Events"
        key code ${keyCodeMap[direction]} using {control down}
        delay 0.2
        key up control
    end tell
    `
}

export const zoomInOrOut = (isIn: boolean = true): string => {
  return `tell application "System Events"
        key code ${keyCodeMap[isIn ? 'add' : 'minus']} using {command down}
        delay 0.2
        key up control
    end tell
    `
}
