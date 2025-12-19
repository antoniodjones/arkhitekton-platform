/**
 * TipTap Drag Handle - Disabled for now
 * Story: US-WIKI-007 - Block drag-and-drop reordering
 * 
 * This feature requires more investigation to work properly with TipTap.
 * Marking as partially complete - will revisit with a different approach.
 */

import { Extension } from '@tiptap/core';

// Empty extension - drag handle is disabled
export const DragHandle = Extension.create({
  name: 'dragHandle',
});

export const dragHandleStyles = `
  /* Drag handle styles - currently disabled */
`;

export function initDraggableBlocks(_editorElement: HTMLElement) {
  // No-op
}
