import { useHotkeys } from 'react-hotkeys-hook';
import { useRef, useCallback } from 'react';

export interface UseSearchShortcutOptions {
  onOpen?: () => void;
  onClose?: () => void;
  enabled?: boolean;
}

/**
 * Custom hook for global search keyboard shortcuts
 * 
 * Binds Cmd+K (Mac) and Ctrl+K (Windows/Linux) to trigger search
 * 
 * @example
 * ```tsx
 * const searchInputRef = useRef<HTMLInputElement>(null);
 * 
 * useSearchShortcut({
 *   onOpen: () => searchInputRef.current?.focus(),
 *   onClose: () => searchInputRef.current?.blur()
 * });
 * ```
 */
export function useSearchShortcut(options: UseSearchShortcutOptions = {}) {
  const { onOpen, onClose, enabled = true } = options;

  // Cmd+K for Mac, Ctrl+K for Windows/Linux
  useHotkeys(
    'mod+k',
    (event) => {
      event.preventDefault();
      onOpen?.();
    },
    {
      enabled,
      enableOnFormTags: ['INPUT', 'TEXTAREA', 'SELECT'], // Allow even when input is focused
    }
  );

  // Escape to close search
  useHotkeys(
    'escape',
    (event) => {
      onClose?.();
    },
    {
      enabled,
      enableOnFormTags: ['INPUT'],
    }
  );

  return {
    shortcutKey: navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? '⌘K' : 'Ctrl+K',
  };
}

/**
 * Hook for keyboard navigation within search results
 * Handles ArrowUp, ArrowDown, Enter, and Escape
 */
export function useSearchNavigation(options: {
  resultsCount: number;
  onSelect: (index: number) => void;
  onClose: () => void;
  enabled?: boolean;
}) {
  const { resultsCount, onSelect, onClose, enabled = true } = options;
  const selectedIndexRef = useRef<number>(-1);

  const handleArrowDown = useCallback(() => {
    selectedIndexRef.current = Math.min(selectedIndexRef.current + 1, resultsCount - 1);
    return selectedIndexRef.current;
  }, [resultsCount]);

  const handleArrowUp = useCallback(() => {
    selectedIndexRef.current = Math.max(selectedIndexRef.current - 1, -1);
    return selectedIndexRef.current;
  }, []);

  const handleEnter = useCallback(() => {
    if (selectedIndexRef.current >= 0) {
      onSelect(selectedIndexRef.current);
    }
  }, [onSelect]);

  const handleEscape = useCallback(() => {
    selectedIndexRef.current = -1;
    onClose();
  }, [onClose]);

  // Arrow Down
  useHotkeys(
    'down',
    (event) => {
      event.preventDefault();
      const newIndex = handleArrowDown();
      return newIndex;
    },
    {
      enabled: enabled && resultsCount > 0,
      enableOnFormTags: ['INPUT'],
    },
    [resultsCount]
  );

  // Arrow Up
  useHotkeys(
    'up',
    (event) => {
      event.preventDefault();
      const newIndex = handleArrowUp();
      return newIndex;
    },
    {
      enabled: enabled && resultsCount > 0,
      enableOnFormTags: ['INPUT'],
    },
    [resultsCount]
  );

  // Enter
  useHotkeys(
    'enter',
    (event) => {
      if (selectedIndexRef.current >= 0) {
        event.preventDefault();
        handleEnter();
      }
    },
    {
      enabled: enabled && resultsCount > 0,
      enableOnFormTags: ['INPUT'],
    },
    [resultsCount, onSelect]
  );

  // Escape
  useHotkeys(
    'escape',
    (event) => {
      event.preventDefault();
      handleEscape();
    },
    {
      enabled,
      enableOnFormTags: ['INPUT'],
    }
  );

  return {
    selectedIndex: selectedIndexRef.current,
    setSelectedIndex: (index: number) => {
      selectedIndexRef.current = index;
    },
  };
}

