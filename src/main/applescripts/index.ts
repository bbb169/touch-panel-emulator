const directionMap = {
  left: 123,
  right: 124,
  top: 126
}

export const threeFingerSwitchWindow = (direction: keyof typeof directionMap): string => {
  return `tell application "System Events"
        key code ${directionMap[direction]} using {control down}
        delay 0.2
        key up control
    end tell
    `
}
