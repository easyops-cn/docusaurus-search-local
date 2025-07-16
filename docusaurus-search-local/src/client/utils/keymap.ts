import { isMacPlatform } from './platform';

export interface ParsedKeymap {
  key: string;
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  meta: boolean;
}

export function parseKeymap(keymap: string): ParsedKeymap {
  const parts = keymap.toLowerCase().split('+');
  const result: ParsedKeymap = {
    key: '',
    ctrl: false,
    alt: false,
    shift: false,
    meta: false,
  };

  // Detect if we're on Mac to handle 'mod' appropriately
  const isMac = isMacPlatform();

  for (const part of parts) {
    const trimmed = part.trim();
    switch (trimmed) {
      case 'ctrl':
        result.ctrl = true;
        break;
      case 'cmd':
        result.meta = true;
        break;
      case 'mod':
        if (isMac) {
          result.meta = true;
        } else {
          result.ctrl = true;
        }
        break;
      case 'alt':
        result.alt = true;
        break;
      case 'shift':
        result.shift = true;
        break;
      default:
        result.key = trimmed;
        break;
    }
  }

  return result;
}

export function matchesKeymap(event: KeyboardEvent, keymap: ParsedKeymap): boolean {
  return (
    event.key.toLowerCase() === keymap.key &&
    event.ctrlKey === keymap.ctrl &&
    event.altKey === keymap.alt &&
    event.shiftKey === keymap.shift &&
    event.metaKey === keymap.meta
  );
}

export function getKeymapHints(keymap: string, isMac: boolean): string[] {
  const parsedKeymap = parseKeymap(keymap);
  const hints: string[] = [];

  // Handle original keymap string to detect 'mod' for proper hint display
  const parts = keymap.toLowerCase().split('+').map(p => p.trim());
  const hasMod = parts.includes('mod');

  if (parsedKeymap.ctrl && !hasMod) {
    hints.push('ctrl');
  }
  if (parsedKeymap.meta && !hasMod) {
    hints.push(isMac ? '⌘' : 'cmd');
  }
  if (hasMod) {
    hints.push(isMac ? '⌘' : 'ctrl');
  }
  if (parsedKeymap.alt) {
    hints.push(isMac ? '⌥' : 'alt');
  }
  if (parsedKeymap.shift) {
    hints.push(isMac ? '⇧' : 'shift');
  }
  if (parsedKeymap.key) {
    hints.push(parsedKeymap.key.toUpperCase());
  }

  return hints;
}