import { isMacPlatform } from './platform';

describe('platform utility functions', () => {
  // Store original navigator to restore after tests
  const originalNavigator = global.navigator;
  
  afterEach(() => {
    // Restore original navigator after each test
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      configurable: true
    });
  });

  describe('isMacPlatform', () => {
    test('should return false when navigator is undefined', () => {
      Object.defineProperty(global, 'navigator', {
        value: undefined,
        configurable: true
      });
      
      expect(isMacPlatform()).toBe(false);
    });

    test('should detect Mac using userAgentData.platform', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgentData: { platform: 'macOS' },
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          platform: 'Win32'
        },
        configurable: true
      });

      expect(isMacPlatform()).toBe(true);
    });

    test('should detect non-Mac using userAgentData.platform', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgentData: { platform: 'Windows' },
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          platform: 'MacIntel'
        },
        configurable: true
      });

      expect(isMacPlatform()).toBe(false);
    });

    test('should fallback to userAgent when userAgentData is not available', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          platform: 'Win32'
        },
        configurable: true
      });

      expect(isMacPlatform()).toBe(true);
    });

    test('should detect non-Mac using userAgent fallback', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          platform: 'MacIntel'
        },
        configurable: true
      });

      expect(isMacPlatform()).toBe(false);
    });

    test('should fallback to platform when userAgent is not available', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          platform: 'MacIntel'
        },
        configurable: true
      });

      expect(isMacPlatform()).toBe(true);
    });

    test('should detect non-Mac using platform fallback', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          platform: 'Win32'
        },
        configurable: true
      });

      expect(isMacPlatform()).toBe(false);
    });

    test('should return false when no platform detection methods are available', () => {
      Object.defineProperty(global, 'navigator', {
        value: {},
        configurable: true
      });

      expect(isMacPlatform()).toBe(false);
    });

    test('should handle case insensitive platform detection', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgentData: { platform: 'MACOS' },
        },
        configurable: true
      });

      expect(isMacPlatform()).toBe(true);
    });
  });
});