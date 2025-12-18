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

export const DragHandle = Extension.create({
  name: 'dragHandle',

  addProseMirrorPlugins() {
    let dragHandle: HTMLElement | null = null;
    let currentBlockPos: number | null = null;
    let currentBlockNode: any = null;
    let isDragging = false;
    let hideTimeout: ReturnType<typeof setTimeout> | null = null;

    return [
      new Plugin({
        key: DragHandleKey,
        view(editorView) {
          // Create the drag handle element
          dragHandle = document.createElement('div');
          dragHandle.className = 'tiptap-drag-handle';
          dragHandle.draggable = true;
          dragHandle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="9" cy="5" r="1.5"/>
              <circle cx="9" cy="12" r="1.5"/>
              <circle cx="9" cy="19" r="1.5"/>
              <circle cx="15" cy="5" r="1.5"/>
              <circle cx="15" cy="12" r="1.5"/>
              <circle cx="15" cy="19" r="1.5"/>
            </svg>
          `;
          dragHandle.style.display = 'none';
          
          // Append to editor parent so it's in the same container
          editorView.dom.parentElement?.appendChild(dragHandle);

          // Keep handle visible when hovering over it
          dragHandle.addEventListener('mouseenter', () => {
            if (hideTimeout) {
              clearTimeout(hideTimeout);
              hideTimeout = null;
            }
          });

          dragHandle.addEventListener('mouseleave', () => {
            if (!isDragging) {
              hideHandle();
            }
          });

          // Drag start
          dragHandle.addEventListener('dragstart', (e) => {
            if (currentBlockPos === null || !currentBlockNode) return;
            
            isDragging = true;
            editorView.dom.classList.add('is-dragging');
            
            e.dataTransfer?.setData('text/plain', '');
            if (e.dataTransfer) {
              e.dataTransfer.effectAllowed = 'move';
            }
          });

          // Drag end
          dragHandle.addEventListener('dragend', () => {
            isDragging = false;
            editorView.dom.classList.remove('is-dragging');
            document.querySelectorAll('.drop-target').forEach(el => 
              el.classList.remove('drop-target', 'drop-before', 'drop-after')
            );
            hideHandle();
          });

          // Helper functions
          const showHandle = (blockDom: HTMLElement) => {
            if (!dragHandle) return;
            if (hideTimeout) {
              clearTimeout(hideTimeout);
              hideTimeout = null;
            }
            
            const rect = blockDom.getBoundingClientRect();
            const parentRect = editorView.dom.parentElement?.getBoundingClientRect();
            
            if (parentRect) {
              dragHandle.style.display = 'flex';
              dragHandle.style.top = `${rect.top - parentRect.top + 2}px`;
              dragHandle.style.left = '-24px';
            }
          };

          const hideHandle = () => {
            if (isDragging) return;
            hideTimeout = setTimeout(() => {
              if (dragHandle && !isDragging) {
                dragHandle.style.display = 'none';
              }
            }, 150);
          };

          const getBlockAtCoords = (y: number) => {
            const editorRect = editorView.dom.getBoundingClientRect();
            const posAtCoords = editorView.posAtCoords({ 
              left: editorRect.left + 20, 
              top: y 
            });
            
            if (!posAtCoords) return null;

            const $pos = editorView.state.doc.resolve(posAtCoords.pos);
            if ($pos.depth === 0) return null;
            
            const blockPos = $pos.before(1);
            const blockNode = editorView.state.doc.nodeAt(blockPos);
            
            if (!blockNode || !blockNode.isBlock) return null;

            const dom = editorView.nodeDOM(blockPos);
            if (!dom || !(dom instanceof HTMLElement)) return null;

            return { node: blockNode, pos: blockPos, dom };
          };

          // Mouse move on editor
          const onMouseMove = (event: MouseEvent) => {
            if (isDragging) return;

            const block = getBlockAtCoords(event.clientY);
            
            if (block) {
              currentBlockPos = block.pos;
              currentBlockNode = block.node;
              showHandle(block.dom);
            }
          };

          // Mouse leave editor (with delay to allow moving to handle)
          const onMouseLeave = () => {
            if (!isDragging) {
              hideHandle();
            }
          };

          // Drag over editor
          const onDragOver = (e: DragEvent) => {
            if (!isDragging) return;
            
            e.preventDefault();
            if (e.dataTransfer) {
              e.dataTransfer.dropEffect = 'move';
            }

            const block = getBlockAtCoords(e.clientY);
            
            // Clear old targets
            document.querySelectorAll('.drop-target').forEach(el => 
              el.classList.remove('drop-target', 'drop-before', 'drop-after')
            );

            if (block && block.pos !== currentBlockPos) {
              const rect = block.dom.getBoundingClientRect();
              const midY = rect.top + rect.height / 2;
              
              if (e.clientY < midY) {
                block.dom.classList.add('drop-target', 'drop-before');
              } else {
                block.dom.classList.add('drop-target', 'drop-after');
              }
            }
          };

          // Drop on editor
          const onDrop = (e: DragEvent) => {
            if (!isDragging || currentBlockPos === null || !currentBlockNode) return;
            
            e.preventDefault();

            const block = getBlockAtCoords(e.clientY);
            
            if (!block || block.pos === currentBlockPos) {
              return;
            }

            const rect = block.dom.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;
            const insertBefore = e.clientY < midY;

            // Calculate target position
            let targetPos = insertBefore ? block.pos : block.pos + block.node.nodeSize;
            const nodeSize = currentBlockNode.nodeSize;

            // Adjust target if moving downward
            if (targetPos > currentBlockPos) {
              targetPos -= nodeSize;
            }

            // Create transaction
            const { tr } = editorView.state;

            // Delete from original position
            tr.delete(currentBlockPos, currentBlockPos + nodeSize);
            
            // Insert at new position
            tr.insert(targetPos, currentBlockNode);

            // Dispatch
            editorView.dispatch(tr);

            // Cleanup
            document.querySelectorAll('.drop-target').forEach(el => 
              el.classList.remove('drop-target', 'drop-before', 'drop-after')
            );
            
            isDragging = false;
            currentBlockPos = null;
            currentBlockNode = null;
          };

          // Attach listeners
          editorView.dom.addEventListener('mousemove', onMouseMove);
          editorView.dom.addEventListener('mouseleave', onMouseLeave);
          editorView.dom.addEventListener('dragover', onDragOver);
          editorView.dom.addEventListener('drop', onDrop);

          return {
            destroy() {
              editorView.dom.removeEventListener('mousemove', onMouseMove);
              editorView.dom.removeEventListener('mouseleave', onMouseLeave);
              editorView.dom.removeEventListener('dragover', onDragOver);
              editorView.dom.removeEventListener('drop', onDrop);
              if (hideTimeout) clearTimeout(hideTimeout);
              dragHandle?.remove();
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
    position: absolute;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: grab;
    color: #9ca3af;
    background: transparent;
    border-radius: 4px;
    z-index: 50;
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

  .ProseMirror.is-dragging * {
    cursor: grabbing !important;
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
