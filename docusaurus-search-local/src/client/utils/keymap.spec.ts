import { parseKeymap, matchesKeymap, getKeymapHints } from './keymap';
import * as platformModule from './platform';

// Mock the platform module
jest.mock('./platform');

describe('keymap utility functions', () => {
  const mockIsMacPlatform = jest.mocked(platformModule.isMacPlatform);

  beforeEach(() => {
    mockIsMacPlatform.mockClear();
  });
  describe('parseKeymap', () => {
    test('should parse single key', () => {
      const result = parseKeymap('s');
      expect(result).toEqual({
        key: 's',
        ctrl: false,
        alt: false,
        shift: false,
        meta: false,
      });
    });

    test('should parse ctrl+k', () => {
      const result = parseKeymap('ctrl+k');
      expect(result).toEqual({
        key: 'k',
        ctrl: true,
        alt: false,
        shift: false,
        meta: false,
      });
    });

    test('should parse cmd+k', () => {
      const result = parseKeymap('cmd+k');
      expect(result).toEqual({
        key: 'k',
        ctrl: false,
        alt: false,
        shift: false,
        meta: true,
      });
    });

    test('should parse mod+k on Mac-like platform', () => {
      mockIsMacPlatform.mockReturnValue(true);

      const result = parseKeymap('mod+k');
      expect(result).toEqual({
        key: 'k',
        ctrl: false,
        alt: false,
        shift: false,
        meta: true,
      });
    });

    test('should parse mod+k on non-Mac platform', () => {
      mockIsMacPlatform.mockReturnValue(false);

      const result = parseKeymap('mod+k');
      expect(result).toEqual({
        key: 'k',
        ctrl: true,
        alt: false,
        shift: false,
        meta: false,
      });
    });

    test('should parse complex combination', () => {
      const result = parseKeymap('ctrl+shift+alt+f');
      expect(result).toEqual({
        key: 'f',
        ctrl: true,
        alt: true,
        shift: true,
        meta: false,
      });
    });

    test('should handle whitespace', () => {
      const result = parseKeymap(' ctrl + k ');
      expect(result).toEqual({
        key: 'k',
        ctrl: true,
        alt: false,
        shift: false,
        meta: false,
      });
    });
  });

  describe('matchesKeymap', () => {
    test('should match single key', () => {
      const keymap = parseKeymap('s');
      const event = {
        key: 's',
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
      } as KeyboardEvent;

      expect(matchesKeymap(event, keymap)).toBe(true);
    });

    test('should match ctrl+k', () => {
      const keymap = parseKeymap('ctrl+k');
      const event = {
        key: 'k',
        ctrlKey: true,
        altKey: false,
        shiftKey: false,
        metaKey: false,
      } as KeyboardEvent;

      expect(matchesKeymap(event, keymap)).toBe(true);
    });

    test('should not match if modifiers differ', () => {
      const keymap = parseKeymap('ctrl+k');
      const event = {
        key: 'k',
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
      } as KeyboardEvent;

      expect(matchesKeymap(event, keymap)).toBe(false);
    });

    test('should handle case insensitivity', () => {
      const keymap = parseKeymap('ctrl+k');
      const event = {
        key: 'K',
        ctrlKey: true,
        altKey: false,
        shiftKey: false,
        metaKey: false,
      } as KeyboardEvent;

      expect(matchesKeymap(event, keymap)).toBe(true);
    });

    test('should not throw Error on empty Key', () => {
      const keymap = parseKeymap('ctrl+k');
      const event = {
        key: undefined
      }
      expect(matchesKeymap(event, keymap)).toBe(false);
    });
  });

  describe('getKeymapHints', () => {
    test('should generate hints for single key', () => {
      const hints = getKeymapHints('s', false);
      expect(hints).toEqual(['S']);
    });

    test('should generate hints for ctrl+k on non-Mac', () => {
      const hints = getKeymapHints('ctrl+k', false);
      expect(hints).toEqual(['ctrl', 'K']);
    });

    test('should generate hints for cmd+k on Mac', () => {
      const hints = getKeymapHints('cmd+k', true);
      expect(hints).toEqual(['⌘', 'K']);
    });

    test('should generate hints for mod+k on Mac', () => {
      const hints = getKeymapHints('mod+k', true);
      expect(hints).toEqual(['⌘', 'K']);
    });

    test('should generate hints for mod+k on non-Mac', () => {
      const hints = getKeymapHints('mod+k', false);
      expect(hints).toEqual(['ctrl', 'K']);
    });

    test('should generate hints for complex combination on Mac', () => {
      const hints = getKeymapHints('ctrl+shift+alt+f', true);
      expect(hints).toEqual(['ctrl', '⌥', '⇧', 'F']);
    });

    test('should generate hints for complex combination on non-Mac', () => {
      const hints = getKeymapHints('ctrl+shift+alt+f', false);
      expect(hints).toEqual(['ctrl', 'alt', 'shift', 'F']);
    });
  });
});
