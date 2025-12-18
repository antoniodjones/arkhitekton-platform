/**
 * TipTap Drag Handle Extension
 * Story: US-WIKI-007 - Block drag-and-drop reordering
 * 
 * Adds a drag handle to block-level nodes that appears on hover,
 * allowing users to drag and reorder blocks within the editor.
 */

import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export const DragHandleKey = new PluginKey('dragHandle');

// Track drag state
let currentDragHandle: HTMLElement | null = null;
let draggedNodePos: number | null = null;
let draggedNode: any = null;

export const DragHandle = Extension.create({
  name: 'dragHandle',

  addProseMirrorPlugins() {
    const editor = this.editor;

    return [
      new Plugin({
        key: DragHandleKey,
        view(editorView) {
          // Create the drag handle element
          const handle = document.createElement('div');
          handle.className = 'tiptap-drag-handle';
          handle.draggable = true;
          handle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="9" cy="5" r="1.5"/>
              <circle cx="9" cy="12" r="1.5"/>
              <circle cx="9" cy="19" r="1.5"/>
              <circle cx="15" cy="5" r="1.5"/>
              <circle cx="15" cy="12" r="1.5"/>
              <circle cx="15" cy="19" r="1.5"/>
            </svg>
          `;
          
          // Hide initially
          handle.style.display = 'none';
          document.body.appendChild(handle);
          currentDragHandle = handle;

          // Find block node at position
          const getBlockNodeAtPos = (pos: { top: number; left: number }) => {
            const editorRect = editorView.dom.getBoundingClientRect();
            
            // Check if mouse is within editor bounds
            if (pos.left < editorRect.left - 50 || pos.left > editorRect.right + 50) {
              return null;
            }

            // Find the node at this Y position
            const posAtCoords = editorView.posAtCoords({ 
              left: editorRect.left + 20, 
              top: pos.top 
            });
            
            if (!posAtCoords) return null;

            const { pos: nodePos } = posAtCoords;
            const $pos = editorView.state.doc.resolve(nodePos);
            
            // Get the top-level block node
            const depth = $pos.depth;
            if (depth === 0) return null;
            
            const blockPos = $pos.before(1);
            const blockNode = editorView.state.doc.nodeAt(blockPos);
            
            if (!blockNode || !blockNode.isBlock) return null;

            const dom = editorView.nodeDOM(blockPos);
            if (!dom || !(dom instanceof HTMLElement)) return null;

            return { node: blockNode, pos: blockPos, dom };
          };

          // Position the handle next to a block
          const positionHandle = (blockDom: HTMLElement) => {
            const rect = blockDom.getBoundingClientRect();
            const editorRect = editorView.dom.getBoundingClientRect();
            
            handle.style.display = 'flex';
            handle.style.top = `${rect.top + window.scrollY + 4}px`;
            handle.style.left = `${editorRect.left - 28}px`;
          };

          // Mouse move handler
          const onMouseMove = (event: MouseEvent) => {
            if (draggedNodePos !== null) return; // Don't update while dragging

            const block = getBlockNodeAtPos({ top: event.clientY, left: event.clientX });
            
            if (block) {
              positionHandle(block.dom);
              handle.dataset.nodePos = block.pos.toString();
            } else {
              handle.style.display = 'none';
            }
          };

          // Mouse leave handler
          const onMouseLeave = () => {
            if (draggedNodePos === null) {
              handle.style.display = 'none';
            }
          };

          // Drag start
          handle.addEventListener('dragstart', (e) => {
            const pos = parseInt(handle.dataset.nodePos || '0');
            const node = editorView.state.doc.nodeAt(pos);
            
            if (node) {
              draggedNodePos = pos;
              draggedNode = node;
              
              // Set drag image
              const dom = editorView.nodeDOM(pos);
              if (dom instanceof HTMLElement) {
                e.dataTransfer?.setDragImage(dom, 0, 0);
                dom.classList.add('is-being-dragged');
              }
              
              e.dataTransfer?.setData('text/plain', '');
              if (e.dataTransfer) {
                e.dataTransfer.effectAllowed = 'move';
              }
              
              editorView.dom.classList.add('is-dragging');
            }
          });

          // Drag end
          handle.addEventListener('dragend', () => {
            // Cleanup
            document.querySelectorAll('.is-being-dragged').forEach(el => 
              el.classList.remove('is-being-dragged')
            );
            document.querySelectorAll('.drop-target').forEach(el => 
              el.classList.remove('drop-target')
            );
            editorView.dom.classList.remove('is-dragging');
            draggedNodePos = null;
            draggedNode = null;
          });

          // Drag over editor
          editorView.dom.addEventListener('dragover', (e) => {
            if (draggedNodePos === null || !draggedNode) return;
            
            e.preventDefault();
            if (e.dataTransfer) {
              e.dataTransfer.dropEffect = 'move';
            }

            // Find target block
            const block = getBlockNodeAtPos({ top: e.clientY, left: e.clientX });
            
            // Clear old targets
            document.querySelectorAll('.drop-target').forEach(el => 
              el.classList.remove('drop-target', 'drop-before', 'drop-after')
            );

            if (block && block.pos !== draggedNodePos) {
              const rect = block.dom.getBoundingClientRect();
              const midY = rect.top + rect.height / 2;
              
              if (e.clientY < midY) {
                block.dom.classList.add('drop-target', 'drop-before');
              } else {
                block.dom.classList.add('drop-target', 'drop-after');
              }
            }
          });

          // Drop on editor
          editorView.dom.addEventListener('drop', (e) => {
            if (draggedNodePos === null || !draggedNode) return;
            
            e.preventDefault();

            const block = getBlockNodeAtPos({ top: e.clientY, left: e.clientX });
            
            if (!block || block.pos === draggedNodePos) {
              // Cleanup
              draggedNodePos = null;
              draggedNode = null;
              return;
            }

            const rect = block.dom.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;
            const insertBefore = e.clientY < midY;

            // Calculate target position
            let targetPos = insertBefore ? block.pos : block.pos + block.node.nodeSize;

            // Create transaction
            const { tr } = editorView.state;
            const nodeSize = draggedNode.nodeSize;

            // Adjust target if moving downward
            if (targetPos > draggedNodePos) {
              targetPos -= nodeSize;
            }

            // Delete from original position
            tr.delete(draggedNodePos, draggedNodePos + nodeSize);
            
            // Insert at new position
            tr.insert(targetPos, draggedNode);

            // Dispatch
            editorView.dispatch(tr);

            // Cleanup
            document.querySelectorAll('.drop-target').forEach(el => 
              el.classList.remove('drop-target', 'drop-before', 'drop-after')
            );
            draggedNodePos = null;
            draggedNode = null;
          });

          // Attach listeners
          editorView.dom.addEventListener('mousemove', onMouseMove);
          editorView.dom.addEventListener('mouseleave', onMouseLeave);

          return {
            destroy() {
              editorView.dom.removeEventListener('mousemove', onMouseMove);
              editorView.dom.removeEventListener('mouseleave', onMouseLeave);
              handle.remove();
            },
          };
        },
      }),
    ];
  },
});

// CSS styles for the drag handle
export const dragHandleStyles = `
  .tiptap-drag-handle {
    position: fixed;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: grab;
    color: #9ca3af;
    background: transparent;
    border-radius: 4px;
    z-index: 100;
    transition: color 0.15s, background 0.15s;
    user-select: none;
  }

  .tiptap-drag-handle:hover {
    background: #e5e7eb;
    color: #374151;
  }

  .dark .tiptap-drag-handle:hover {
    background: #374151;
    color: #e5e7eb;
  }

  .tiptap-drag-handle:active {
    cursor: grabbing;
  }

  /* Dragging state */
  .ProseMirror.is-dragging {
    cursor: grabbing !important;
  }

  .ProseMirror .is-being-dragged {
    opacity: 0.4;
    background: #fef3c7;
    border-radius: 4px;
  }

  /* Drop target indicators */
  .ProseMirror .drop-target {
    position: relative;
  }

  .ProseMirror .drop-target.drop-before::before {
    content: '';
    position: absolute;
    top: -2px;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #6366f1, #a855f7);
    border-radius: 2px;
    box-shadow: 0 0 8px rgba(99, 102, 241, 0.5);
  }

  .ProseMirror .drop-target.drop-after::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #6366f1, #a855f7);
    border-radius: 2px;
    box-shadow: 0 0 8px rgba(99, 102, 241, 0.5);
  }
`;
