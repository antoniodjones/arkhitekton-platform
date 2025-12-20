/**
 * Block Drag Handle Component
 * Story: US-WIKI-007 - Block drag-and-drop reordering
 * Supports both top-level blocks AND individual list items
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { GripVertical } from 'lucide-react';

interface DragInfo {
  pos: number;           // Position in document
  depth: number;         // 1 = top-level block, 2 = list item
  parentPos?: number;    // Parent list position (for list items)
  index: number;         // Index within parent
}

interface BlockDragHandleProps {
  editor: Editor | null;
  editorRef: React.RefObject<HTMLDivElement>;
}

export function BlockDragHandle({ editor, editorRef }: BlockDragHandleProps) {
  const [handleTop, setHandleTop] = useState(0);
  const [handleLeft, setHandleLeft] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dropTop, setDropTop] = useState<number | null>(null);
  const [isListItem, setIsListItem] = useState(false);

  const currentDragInfo = useRef<DragInfo | null>(null);
  const dragSource = useRef<DragInfo | null>(null);
  const dragTarget = useRef<DragInfo | null>(null);
  const dropAfterTarget = useRef<boolean>(false);
  const isOverHandle = useRef(false);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  // Find block or list item at position and show handle
  const updateHandlePosition = useCallback((clientX: number, clientY: number) => {
    if (!editor || !editorRef.current || !editor.isEditable || isDragging) return;
    
    // IMPORTANT: Don't hide if mouse is over the handle
    if (isOverHandle.current) return;

    const editorRect = editorRef.current.getBoundingClientRect();
    
    // Keep visible if mouse is in the left zone
    const isInHandleZone = clientX >= editorRect.left - 20 && 
                           clientX <= editorRect.left + 60 &&
                           clientY >= editorRect.top && 
                           clientY <= editorRect.bottom;
    
    if (isInHandleZone && isVisible) {
      return;
    }
    
    const hideWithDelay = () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => {
        if (!isOverHandle.current && !isDragging) {
          setIsVisible(false);
        }
      }, 300);
    };
    
    if (clientY < editorRect.top || clientY > editorRect.bottom) {
      hideWithDelay();
      return;
    }

    const searchX = Math.max(clientX, editorRect.left + 80);
    const pos = editor.view.posAtCoords({ left: searchX, top: clientY });
    if (!pos) {
      hideWithDelay();
      return;
    }

    try {
      const $pos = editor.state.doc.resolve(pos.pos);
      if ($pos.depth === 0) {
        hideWithDelay();
        return;
      }

      // Check if we're inside a list item (depth 2+)
      let targetDepth = 1;
      let targetPos = $pos.before(1);
      let parentPos: number | undefined;
      let itemIndex = 0;
      let handleOffset = 0;

      // Look for listItem at depth 2
      if ($pos.depth >= 2) {
        const parentNode = $pos.node(1);
        if (parentNode && (parentNode.type.name === 'bulletList' || parentNode.type.name === 'orderedList')) {
          // We're inside a list - find the list item
          for (let d = $pos.depth; d >= 1; d--) {
            const node = $pos.node(d);
            if (node.type.name === 'listItem') {
              targetDepth = 2;
              targetPos = $pos.before(d);
              parentPos = $pos.before(1);
              // Find index of this list item in parent
              const parent = $pos.node(d - 1);
              let idx = 0;
              parent.forEach((child, offset) => {
                if ($pos.before(d) === $pos.start(d - 1) + offset) {
                  itemIndex = idx;
                }
                idx++;
              });
              handleOffset = 24; // Indent for list items
              break;
            }
          }
        }
      }

      const node = editor.state.doc.nodeAt(targetPos);
      if (!node) {
        hideWithDelay();
        return;
      }

      currentDragInfo.current = {
        pos: targetPos,
        depth: targetDepth,
        parentPos,
        index: itemIndex
      };

      const dom = editor.view.nodeDOM(targetPos);
      if (dom instanceof HTMLElement) {
        if (hideTimer.current) clearTimeout(hideTimer.current);
        
        const blockRect = dom.getBoundingClientRect();
        setHandleTop(blockRect.top - editorRect.top);
        setHandleLeft(handleOffset);
        setIsListItem(targetDepth === 2);
        setIsVisible(true);
      }
    } catch (e) {
      // Position might be invalid
    }
  }, [editor, editorRef, isDragging, isVisible]);

  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      updateHandlePosition(e.clientX, e.clientY);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [updateHandlePosition]);

  // Drag start
  const onDragStart = useCallback((e: React.DragEvent) => {
    console.log('=== DRAG START ===');
    if (!editor || !currentDragInfo.current) {
      console.log('No editor or drag info');
      return;
    }

    const info = currentDragInfo.current;
    const node = editor.state.doc.nodeAt(info.pos);
    console.log('Drag source:', info, 'node:', node?.type.name);
    if (!node) return;

    dragSource.current = { ...info };
    setIsDragging(true);

    // Custom drag image
    const label = info.depth === 2 ? '↕ Moving item...' : '↕ Moving block...';
    const img = document.createElement('div');
    img.textContent = label;
    img.style.cssText = `
      position: fixed; top: -100px; left: -100px;
      background: #6366f1; color: white;
      padding: 6px 12px; border-radius: 6px;
      font-size: 13px; font-weight: 500;
    `;
    document.body.appendChild(img);
    e.dataTransfer.setDragImage(img, 0, 0);
    requestAnimationFrame(() => img.remove());

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', info.depth === 2 ? 'listItem' : 'block');
  }, [editor]);

  // Drag over - show drop indicator and save target position
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (!editor || !editorRef.current || !dragSource.current) return;

    const editorElement = editorRef.current.querySelector('.ProseMirror');
    if (!editorElement) return;
    
    const editorRect = editorElement.getBoundingClientRect();
    const source = dragSource.current;
    
    // For list items, only allow dropping within same list
    if (source.depth === 2 && source.parentPos !== undefined) {
      const parentNode = editor.state.doc.nodeAt(source.parentPos);
      if (parentNode) {
        let foundInfo: DragInfo | null = null;
        let foundAfter = false;
        let bestTop: number | null = null;
        
        let itemPos = source.parentPos + 1; // Start after list opening
        let idx = 0;
        parentNode.forEach((child) => {
          const dom = editor.view.nodeDOM(itemPos);
          if (dom instanceof HTMLElement) {
            const rect = dom.getBoundingClientRect();
            if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
              foundInfo = { pos: itemPos, depth: 2, parentPos: source.parentPos, index: idx };
              foundAfter = e.clientY > rect.top + rect.height / 2;
              bestTop = foundAfter ? rect.bottom - editorRect.top : rect.top - editorRect.top;
            }
          }
          itemPos += child.nodeSize;
          idx++;
        });

        if (foundInfo && foundInfo.pos !== source.pos) {
          dragTarget.current = foundInfo;
          dropAfterTarget.current = foundAfter;
          setDropTop(bestTop);
        } else {
          dragTarget.current = null;
          setDropTop(null);
        }
        return;
      }
    }
    
    // Top-level block handling
    const doc = editor.state.doc;
    let foundInfo: DragInfo | null = null;
    let foundAfter = false;
    let bestTop: number | null = null;
    
    let currentPos = 0;
    let idx = 0;
    doc.forEach((node) => {
      const dom = editor.view.nodeDOM(currentPos);
      if (dom instanceof HTMLElement) {
        const rect = dom.getBoundingClientRect();
        if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
          foundInfo = { pos: currentPos, depth: 1, index: idx };
          foundAfter = e.clientY > rect.top + rect.height / 2;
          bestTop = foundAfter ? rect.bottom - editorRect.top : rect.top - editorRect.top;
        }
      }
      currentPos += node.nodeSize;
      idx++;
    });

    if (foundInfo && foundInfo.pos !== source.pos) {
      dragTarget.current = foundInfo;
      dropAfterTarget.current = foundAfter;
      setDropTop(bestTop);
    } else {
      dragTarget.current = null;
      setDropTop(null);
    }
  }, [editor, editorRef]);

  // Drop - move the block or list item
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('=== DROP ===');
    
    setDropTop(null);
    setIsDragging(false);

    if (!editor) {
      console.log('No editor');
      return;
    }
    
    const source = dragSource.current;
    const target = dragTarget.current;
    const insertAfter = dropAfterTarget.current;
    
    console.log('Source:', source, 'Target:', target, 'After:', insertAfter);

    if (!source || !target) {
      console.log('Missing source or target');
      return;
    }
    
    if (source.pos === target.pos) {
      console.log('Same position');
      return;
    }

    try {
      const json = editor.getJSON();
      
      // Handle list item reordering
      if (source.depth === 2 && target.depth === 2 && source.parentPos === target.parentPos) {
        console.log('List item reorder');
        
        // Find the parent list in JSON
        let listIndex = -1;
        let currentPos = 0;
        editor.state.doc.forEach((node, offset, idx) => {
          if (currentPos === source.parentPos) {
            listIndex = idx;
          }
          currentPos += node.nodeSize;
        });
        
        if (listIndex === -1 || !json.content) {
          console.log('Could not find list');
          return;
        }
        
        const list = json.content[listIndex];
        if (!list.content || list.content.length < 2) {
          console.log('List has < 2 items');
          return;
        }
        
        // Find source and target indices within the list
        const sourceIdx = source.index;
        const targetIdx = target.index;
        
        console.log('List indices - source:', sourceIdx, 'target:', targetIdx);
        
        // Remove and reinsert
        const [movedItem] = list.content.splice(sourceIdx, 1);
        let newIdx = targetIdx;
        if (sourceIdx < targetIdx) newIdx--;
        if (insertAfter) newIdx++;
        
        list.content.splice(newIdx, 0, movedItem);
        console.log('Moved list item to index:', newIdx);
        
      } else {
        // Top-level block reordering
        console.log('Block reorder');
        
        if (!json.content || json.content.length < 2) {
          console.log('Not enough blocks');
          return;
        }

        const sourceIdx = source.index;
        const targetIdx = target.index;
        
        console.log('Block indices - source:', sourceIdx, 'target:', targetIdx);

        const [movedBlock] = json.content.splice(sourceIdx, 1);
        let newIdx = targetIdx;
        if (sourceIdx < targetIdx) newIdx--;
        if (insertAfter) newIdx++;

        json.content.splice(newIdx, 0, movedBlock);
        console.log('Moved block to index:', newIdx);
      }

      // Update editor content
      editor.commands.setContent(json, false);
      console.log('=== MOVED ===');
      
    } catch (err) {
      console.error('Drop error:', err);
    } finally {
      dragSource.current = null;
      dragTarget.current = null;
    }
  }, [editor]);

  // Drag end - cleanup
  const onDragEnd = useCallback(() => {
    setIsDragging(false);
    setDropTop(null);
    dragSource.current = null;
    dragTarget.current = null;
  }, []);

  if (!editor?.isEditable) return null;

  return (
    <>
      {/* Drag Handle */}
      <div
        draggable
        onMouseEnter={() => { 
          isOverHandle.current = true; 
          if (hideTimer.current) clearTimeout(hideTimer.current);
        }}
        onMouseLeave={() => { isOverHandle.current = false; }}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        style={{ top: handleTop, left: handleLeft }}
        className={`
          absolute w-6 h-6 
          flex items-center justify-center
          cursor-grab active:cursor-grabbing
          text-gray-400 hover:text-gray-700 hover:bg-gray-100
          dark:hover:text-gray-200 dark:hover:bg-gray-700
          rounded transition-opacity duration-75
          select-none z-50
          ${isVisible || isDragging ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          ${isListItem ? 'scale-90' : ''}
        `}
        title={isListItem ? "Drag to reorder item" : "Drag to reorder block"}
      >
        <GripVertical className={isListItem ? "w-4 h-4" : "w-5 h-5"} />
      </div>

      {/* Drop Indicator Line */}
      {dropTop !== null && (
        <div
          style={{ top: dropTop }}
          className="absolute left-0 right-0 h-1 bg-purple-500 rounded-full z-[100] pointer-events-none shadow-[0_0_8px_rgba(168,85,247,0.7)]"
        />
      )}

      {/* Invisible drop zone over editor during drag */}
      {isDragging && (
        <div
          className="absolute inset-0 z-40"
          onDragOver={onDragOver}
          onDrop={onDrop}
        />
      )}
    </>
  );
}
