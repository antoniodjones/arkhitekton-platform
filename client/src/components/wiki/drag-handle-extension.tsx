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
import { NodeSelection } from '@tiptap/pm/state';

export const DragHandleKey = new PluginKey('dragHandle');

// Track the dragged node position
let draggedNodePos: number | null = null;
let draggedNodeSize: number | null = null;
let dropIndicatorPos: number | null = null;

export const DragHandle = Extension.create({
  name: 'dragHandle',

  addProseMirrorPlugins() {
    const { editor } = this;

    return [
      new Plugin({
        key: DragHandleKey,
        props: {
          decorations(state) {
            const { doc } = state;
            const decorations: Decoration[] = [];

            doc.descendants((node, pos) => {
              // Only add handles to top-level block nodes (not nested)
              const $pos = doc.resolve(pos);
              if ($pos.depth === 1 && node.isBlock && node.type.name !== 'doc') {
                const widget = Decoration.widget(pos, () => {
                  const handle = document.createElement('div');
                  handle.className = 'drag-handle';
                  handle.setAttribute('contenteditable', 'false');
                  handle.setAttribute('draggable', 'true');
                  handle.setAttribute('data-node-pos', pos.toString());
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

                  // Drag start handler
                  handle.addEventListener('dragstart', (e) => {
                    const nodePos = parseInt(handle.getAttribute('data-node-pos') || '0');
                    const resolvedNode = state.doc.nodeAt(nodePos);
                    
                    if (resolvedNode) {
                      draggedNodePos = nodePos;
                      draggedNodeSize = resolvedNode.nodeSize;
                      
                      // Add dragging class
                      handle.closest('.ProseMirror')?.classList.add('is-dragging-block');
                      
                      // Set drag data
                      e.dataTransfer?.setData('text/plain', nodePos.toString());
                      if (e.dataTransfer) {
                        e.dataTransfer.effectAllowed = 'move';
                      }
                    }
                  });

                  handle.addEventListener('dragend', () => {
                    // Cleanup
                    handle.closest('.ProseMirror')?.classList.remove('is-dragging-block');
                    document.querySelectorAll('.drop-indicator').forEach(el => el.remove());
                    draggedNodePos = null;
                    draggedNodeSize = null;
                    dropIndicatorPos = null;
                  });

                  return handle;
                }, {
                  side: -1,
                  key: `drag-handle-${pos}`,
                });
                decorations.push(widget);

                // Add drop indicator decoration if we're dragging
                if (dropIndicatorPos === pos) {
                  const indicator = Decoration.widget(pos, () => {
                    const line = document.createElement('div');
                    line.className = 'drop-indicator';
                    return line;
                  }, {
                    side: -1,
                    key: `drop-indicator-${pos}`,
                  });
                  decorations.push(indicator);
                }
              }
            });

            return DecorationSet.create(doc, decorations);
          },

          handleDOMEvents: {
            dragover(view, event) {
              if (draggedNodePos === null) return false;
              
              event.preventDefault();
              if (event.dataTransfer) {
                event.dataTransfer.dropEffect = 'move';
              }

              // Find the block we're hovering over
              const coords = { left: event.clientX, top: event.clientY };
              const posAtCoords = view.posAtCoords(coords);
              
              if (posAtCoords) {
                const $pos = view.state.doc.resolve(posAtCoords.pos);
                // Find the nearest top-level block
                let targetPos = $pos.before(1);
                
                // Determine if we should insert before or after based on mouse Y position
                const domNode = view.nodeDOM(targetPos);
                if (domNode instanceof HTMLElement) {
                  const rect = domNode.getBoundingClientRect();
                  const midY = rect.top + rect.height / 2;
                  
                  if (event.clientY > midY) {
                    // Insert after this block
                    const node = view.state.doc.nodeAt(targetPos);
                    if (node) {
                      targetPos = targetPos + node.nodeSize;
                    }
                  }
                }
                
                // Update drop indicator
                if (dropIndicatorPos !== targetPos) {
                  dropIndicatorPos = targetPos;
                  // Remove old indicators
                  document.querySelectorAll('.drop-indicator').forEach(el => el.remove());
                  
                  // Add new indicator
                  const indicator = document.createElement('div');
                  indicator.className = 'drop-indicator active';
                  
                  // Position the indicator
                  const domNode = view.nodeDOM(targetPos);
                  if (domNode instanceof HTMLElement) {
                    const rect = domNode.getBoundingClientRect();
                    indicator.style.top = `${rect.top + window.scrollY}px`;
                    indicator.style.left = `${rect.left}px`;
                    indicator.style.width = `${rect.width}px`;
                    document.body.appendChild(indicator);
                  }
                }
              }

              return true;
            },

            drop(view, event) {
              if (draggedNodePos === null || draggedNodeSize === null) return false;
              
              event.preventDefault();

              const coords = { left: event.clientX, top: event.clientY };
              const posAtCoords = view.posAtCoords(coords);
              
              if (!posAtCoords) return false;

              const $pos = view.state.doc.resolve(posAtCoords.pos);
              let targetPos = $pos.before(1);

              // Determine insert position (before or after)
              const domNode = view.nodeDOM(targetPos);
              if (domNode instanceof HTMLElement) {
                const rect = domNode.getBoundingClientRect();
                const midY = rect.top + rect.height / 2;
                
                if (event.clientY > midY) {
                  const node = view.state.doc.nodeAt(targetPos);
                  if (node) {
                    targetPos = targetPos + node.nodeSize;
                  }
                }
              }

              // Don't move to same position
              if (targetPos === draggedNodePos || 
                  targetPos === draggedNodePos + draggedNodeSize) {
                return true;
              }

              // Get the node to move
              const nodeToMove = view.state.doc.nodeAt(draggedNodePos);
              if (!nodeToMove) return false;

              // Create the transaction
              const { tr } = view.state;
              
              // Adjust target position if moving downward
              let adjustedTargetPos = targetPos;
              if (targetPos > draggedNodePos) {
                adjustedTargetPos = targetPos - draggedNodeSize;
              }

              // Delete from original position
              tr.delete(draggedNodePos, draggedNodePos + draggedNodeSize);
              
              // Insert at new position
              tr.insert(adjustedTargetPos, nodeToMove);

              // Apply the transaction
              view.dispatch(tr);

              // Cleanup
              document.querySelectorAll('.drop-indicator').forEach(el => el.remove());
              draggedNodePos = null;
              draggedNodeSize = null;
              dropIndicatorPos = null;

              return true;
            },

            dragleave() {
              // Remove indicators on leave
              document.querySelectorAll('.drop-indicator').forEach(el => el.remove());
              return false;
            },
          },
        },
      }),
    ];
  },
});

// CSS styles for the drag handle
export const dragHandleStyles = `
  .ProseMirror {
    position: relative;
  }

  .drag-handle {
    position: absolute;
    left: -28px;
    width: 20px;
    height: 20px;
    margin-top: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: grab;
    color: #9ca3af;
    opacity: 0;
    transition: opacity 0.15s ease, background 0.15s ease;
    border-radius: 4px;
    user-select: none;
    z-index: 10;
  }

  .drag-handle:hover {
    background: #e5e7eb;
    color: #374151;
  }

  .dark .drag-handle:hover {
    background: #374151;
    color: #e5e7eb;
  }

  .drag-handle:active {
    cursor: grabbing;
  }

  /* Show handles on paragraph hover */
  .ProseMirror > *:hover > .drag-handle,
  .ProseMirror > p:hover + .drag-handle,
  .ProseMirror:focus-within .drag-handle {
    opacity: 0.6;
  }

  .ProseMirror > *:hover > .drag-handle:hover,
  .drag-handle:hover {
    opacity: 1;
  }

  /* Dragging state */
  .ProseMirror.is-dragging-block {
    cursor: grabbing;
  }

  .ProseMirror.is-dragging-block * {
    cursor: grabbing;
  }

  /* Drop indicator */
  .drop-indicator {
    position: fixed;
    height: 3px;
    background: linear-gradient(90deg, #6366f1, #a855f7);
    border-radius: 2px;
    pointer-events: none;
    z-index: 1000;
    box-shadow: 0 0 8px rgba(99, 102, 241, 0.5);
  }

  .drop-indicator::before,
  .drop-indicator::after {
    content: '';
    position: absolute;
    top: -4px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #6366f1;
  }

  .drop-indicator::before {
    left: -5px;
  }

  .drop-indicator::after {
    right: -5px;
  }

  /* Dragged node ghost */
  .ProseMirror [data-dragging="true"] {
    opacity: 0.4;
    background: #fef3c7;
    border-radius: 4px;
  }
`;
