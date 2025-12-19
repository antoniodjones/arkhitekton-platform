/**
 * Block Move Buttons Component
 * Story: US-WIKI-007 - Block reordering via Up/Down arrows
 * Simple, reliable alternative to drag-and-drop
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface BlockMoveButtonsProps {
  editor: Editor | null;
  editorRef: React.RefObject<HTMLDivElement>;
}

interface BlockInfo {
  pos: number;
  index: number;
  isListItem: boolean;
  parentIndex?: number;
  listLength?: number;
}

export function BlockMoveButtons({ editor, editorRef }: BlockMoveButtonsProps) {
  const [buttonsTop, setButtonsTop] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [canMoveUp, setCanMoveUp] = useState(false);
  const [canMoveDown, setCanMoveDown] = useState(false);
  
  const currentBlock = useRef<BlockInfo | null>(null);
  const isOverButtons = useRef(false);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  // Find block at mouse position
  const updatePosition = useCallback((clientX: number, clientY: number) => {
    if (!editor || !editorRef.current || !editor.isEditable) return;
    if (isOverButtons.current) return;

    const editorRect = editorRef.current.getBoundingClientRect();
    
    // Check if in left zone
    const isInZone = clientX >= editorRect.left - 40 && 
                     clientX <= editorRect.left + 60 &&
                     clientY >= editorRect.top && 
                     clientY <= editorRect.bottom;
    
    if (isInZone && isVisible) return;
    
    const hideWithDelay = () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => {
        if (!isOverButtons.current) {
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

      const json = editor.getJSON();
      if (!json.content) return;

      // Find top-level block
      let blockPos = $pos.before(1);
      let blockIndex = -1;
      let currentPos = 0;
      let idx = 0;
      
      editor.state.doc.forEach((node) => {
        if (currentPos === blockPos) blockIndex = idx;
        currentPos += node.nodeSize;
        idx++;
      });

      // Check if inside a list item
      let isListItem = false;
      let parentIndex = -1;
      let itemIndex = -1;
      let listLength = 0;

      if ($pos.depth >= 2) {
        const parentNode = $pos.node(1);
        if (parentNode && (parentNode.type.name === 'bulletList' || parentNode.type.name === 'orderedList')) {
          isListItem = true;
          parentIndex = blockIndex;
          listLength = parentNode.childCount;
          
          // Find which list item we're in
          for (let d = $pos.depth; d >= 1; d--) {
            const node = $pos.node(d);
            if (node.type.name === 'listItem') {
              // Count items before this one
              let count = 0;
              const parent = $pos.node(d - 1);
              const targetPos = $pos.before(d);
              let checkPos = $pos.start(d - 1);
              parent.forEach((child) => {
                if (checkPos < targetPos) count++;
                checkPos += child.nodeSize;
              });
              itemIndex = count;
              break;
            }
          }
        }
      }

      if (isListItem) {
        setCanMoveUp(itemIndex > 0);
        setCanMoveDown(itemIndex < listLength - 1);
        currentBlock.current = {
          pos: blockPos,
          index: itemIndex,
          isListItem: true,
          parentIndex,
          listLength
        };
      } else {
        setCanMoveUp(blockIndex > 0);
        setCanMoveDown(blockIndex < json.content.length - 1);
        currentBlock.current = {
          pos: blockPos,
          index: blockIndex,
          isListItem: false
        };
      }

      // Get DOM element for positioning
      let targetPos = blockPos;
      if (isListItem) {
        // Find the list item position
        for (let d = $pos.depth; d >= 1; d--) {
          if ($pos.node(d).type.name === 'listItem') {
            targetPos = $pos.before(d);
            break;
          }
        }
      }

      const dom = editor.view.nodeDOM(targetPos);
      if (dom instanceof HTMLElement) {
        if (hideTimer.current) clearTimeout(hideTimer.current);
        const blockRect = dom.getBoundingClientRect();
        setButtonsTop(blockRect.top - editorRect.top);
        setIsVisible(true);
      }
    } catch (e) {
      // Position might be invalid
    }
  }, [editor, editorRef, isVisible]);

  // Mouse move listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [updatePosition]);

  // Move up
  const moveUp = useCallback(() => {
    if (!editor || !currentBlock.current || !canMoveUp) return;
    
    const block = currentBlock.current;
    const json = editor.getJSON();
    if (!json.content) return;

    try {
      if (block.isListItem && block.parentIndex !== undefined) {
        const list = json.content[block.parentIndex];
        if (list?.content && block.index > 0) {
          const [item] = list.content.splice(block.index, 1);
          list.content.splice(block.index - 1, 0, item);
          editor.commands.setContent(json, false);
          currentBlock.current = { ...block, index: block.index - 1 };
          setCanMoveUp(block.index - 1 > 0);
          setCanMoveDown(true);
        }
      } else {
        if (block.index > 0) {
          const [movedBlock] = json.content.splice(block.index, 1);
          json.content.splice(block.index - 1, 0, movedBlock);
          editor.commands.setContent(json, false);
          currentBlock.current = { ...block, index: block.index - 1 };
          setCanMoveUp(block.index - 1 > 0);
          setCanMoveDown(true);
        }
      }
    } catch (e) {
      console.error('Move up error:', e);
    }
  }, [editor, canMoveUp]);

  // Move down
  const moveDown = useCallback(() => {
    if (!editor || !currentBlock.current || !canMoveDown) return;
    
    const block = currentBlock.current;
    const json = editor.getJSON();
    if (!json.content) return;

    try {
      if (block.isListItem && block.parentIndex !== undefined) {
        const list = json.content[block.parentIndex];
        const maxIdx = (list?.content?.length ?? 1) - 1;
        if (list?.content && block.index < maxIdx) {
          const [item] = list.content.splice(block.index, 1);
          list.content.splice(block.index + 1, 0, item);
          editor.commands.setContent(json, false);
          currentBlock.current = { ...block, index: block.index + 1 };
          setCanMoveUp(true);
          setCanMoveDown(block.index + 1 < maxIdx);
        }
      } else {
        const maxIdx = json.content.length - 1;
        if (block.index < maxIdx) {
          const [movedBlock] = json.content.splice(block.index, 1);
          json.content.splice(block.index + 1, 0, movedBlock);
          editor.commands.setContent(json, false);
          currentBlock.current = { ...block, index: block.index + 1 };
          setCanMoveUp(true);
          setCanMoveDown(block.index + 1 < maxIdx);
        }
      }
    } catch (e) {
      console.error('Move down error:', e);
    }
  }, [editor, canMoveDown]);

  // Don't show if editor not editable or no meaningful content
  if (!editor?.isEditable) return null;
  
  // Check if document has real content (not just empty paragraphs)
  const hasContent = editor.state.doc.textContent.trim().length > 0;
  if (!hasContent) return null;

  return (
    <div
      onMouseEnter={() => { 
        isOverButtons.current = true; 
        if (hideTimer.current) clearTimeout(hideTimer.current);
      }}
      onMouseLeave={() => { isOverButtons.current = false; }}
      style={{ top: buttonsTop }}
      className={`
        absolute -left-1 flex flex-col
        bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-200 dark:border-gray-700
        transition-opacity duration-100
        select-none z-50
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      <button
        onClick={moveUp}
        disabled={!canMoveUp}
        className={`
          w-6 h-6 flex items-center justify-center
          transition-colors rounded-t
          ${canMoveUp 
            ? 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-300 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/30 cursor-pointer' 
            : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'}
        `}
        title="Move up"
      >
        <ChevronUp className="w-4 h-4" />
      </button>
      <button
        onClick={moveDown}
        disabled={!canMoveDown}
        className={`
          w-6 h-6 flex items-center justify-center
          transition-colors rounded-b
          ${canMoveDown 
            ? 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-300 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/30 cursor-pointer' 
            : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'}
        `}
        title="Move down"
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
}

