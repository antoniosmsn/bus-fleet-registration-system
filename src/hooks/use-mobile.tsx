const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Usar método sincrónico para evitar problemas con React hooks
  if (typeof window === "undefined") {
    return false
  }
  
  return window.innerWidth < MOBILE_BREAKPOINT
}
