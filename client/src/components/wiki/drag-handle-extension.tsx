/**
 * TipTap Drag Handle Extension
 * Story: US-WIKI-007 - Block drag-and-drop reordering
 * 
 * Adds a drag handle to block-level nodes that appears on hover,
 * allowing users to drag and reorder blocks within the editor.
 */

import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export const DragHandleKey = new PluginKey('dragHandle');

export const DragHandle = Extension.create({
  name: 'dragHandle',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: DragHandleKey,
        props: {
          decorations(state) {
            const { doc, selection } = state;
            const decorations: Decoration[] = [];

            doc.descendants((node, pos) => {
              // Add drag handle decoration to block-level nodes
              if (node.isBlock && node.type.name !== 'doc') {
                const widget = Decoration.widget(pos, () => {
                  const handle = document.createElement('div');
                  handle.className = 'drag-handle';
                  handle.setAttribute('contenteditable', 'false');
                  handle.setAttribute('draggable', 'true');
                  handle.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="9" cy="5" r="1"/>
                      <circle cx="9" cy="12" r="1"/>
                      <circle cx="9" cy="19" r="1"/>
                      <circle cx="15" cy="5" r="1"/>
                      <circle cx="15" cy="12" r="1"/>
                      <circle cx="15" cy="19" r="1"/>
                    </svg>
                  `;
                  return handle;
                }, {
                  side: -1,
                  key: `drag-handle-${pos}`,
                });
                decorations.push(widget);
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

// CSS styles for the drag handle (add to your global styles or editor styles)
export const dragHandleStyles = `
  .ProseMirror {
    position: relative;
  }

  .drag-handle {
    position: absolute;
    left: -24px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: grab;
    color: #9ca3af;
    opacity: 0;
    transition: opacity 0.15s ease;
    border-radius: 4px;
    user-select: none;
  }

  .drag-handle:hover {
    background: #f3f4f6;
    color: #374151;
  }

  .drag-handle:active {
    cursor: grabbing;
  }

  .ProseMirror:hover .drag-handle,
  .ProseMirror:focus .drag-handle {
    opacity: 1;
  }

  /* Position handle relative to each block */
  .ProseMirror > *:hover > .drag-handle,
  .ProseMirror > * > .drag-handle:hover {
    opacity: 1;
  }

  /* Drag ghost styling */
  .ProseMirror .is-dragging {
    opacity: 0.5;
  }
`;

