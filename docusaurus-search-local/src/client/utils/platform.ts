/**
 * Detects if the current platform is macOS using modern, non-deprecated APIs.
 * Falls back gracefully for older browsers or server-side rendering.
 */
export function isMacPlatform(): boolean {
  // Handle server-side rendering or missing navigator
  if (typeof navigator === 'undefined') {
    return false;
  }

  // Try modern User-Agent Client Hints API first (if available)
  if ('userAgentData' in navigator && (navigator as any).userAgentData?.platform) {
    const platform = (navigator as any).userAgentData.platform.toLowerCase();
    return platform.includes('mac');
  }

  // Fall back to user agent string parsing (more reliable than navigator.platform)
  if (navigator.userAgent) {
    return /mac/i.test(navigator.userAgent);
  }

  // Final fallback to deprecated navigator.platform for very old browsers
  if (navigator.platform) {
    return navigator.platform.toLowerCase().includes('mac');
  }

  return false;
}