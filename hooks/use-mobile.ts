import * as React from "react"

const MOBILE_BREAKPOINT = 768
const query = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

// Reads the screen width without setting state inside an effect (keeps the React lint rules happy).
function subscribe(onChange: () => void) {
  const mql = window.matchMedia(query)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  )
}
