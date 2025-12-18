'use client';

import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { createMentionExtension } from './mention-extension';
import { DragHandle, dragHandleStyles } from './drag-handle-extension';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Minus,
  Link as LinkIcon,
  Image as ImageIcon,
  Highlighter,
  Undo,
  Redo,
  Code2,
  Pilcrow
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Initialize lowlight with common languages
const lowlight = createLowlight(common);

interface TipTapEditorProps {
  content?: any;
  onChange?: (content: any) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
}

export function TipTapEditor({
  content,
  onChange,
  placeholder = 'Start writing your documentation...',
  editable = true,
  className
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We use CodeBlockLowlight instead
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-amber-600 hover:text-amber-700 underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full',
        },
      }),
      Underline,
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-zinc-900 text-zinc-100 rounded-lg p-4 font-mono text-sm overflow-x-auto',
        },
      }),
      // @mention extension for semantic linking
      createMentionExtension(),
      // Drag handle for block reordering (US-WIKI-007)
      DragHandle,
    ],
    content: content || {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
        },
      ],
    },
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-zinc dark:prose-invert max-w-none',
          'focus:outline-none min-h-[200px] px-4 py-3',
          '[&_.is-editor-empty:first-child::before]:text-muted-foreground',
          '[&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
          '[&_.is-editor-empty:first-child::before]:float-left',
          '[&_.is-editor-empty:first-child::before]:h-0',
          '[&_.is-editor-empty:first-child::before]:pointer-events-none',
        ),
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    
    const url = window.prompt('Image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={cn('border rounded-lg bg-background', className)}>
      {/* Toolbar */}
      {editable && (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30">
          {/* History */}
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="h-8 w-8 p-0"
              title="Undo"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="h-8 w-8 p-0"
              title="Redo"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Text Formatting */}
          <div className="flex items-center gap-0.5">
            <Toggle
              size="sm"
              pressed={editor.isActive('bold')}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
              className="h-8 w-8 p-0"
              title="Bold (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive('italic')}
              onPressedChange={() => editor.chain().focus().toggleItalic().run()}
              className="h-8 w-8 p-0"
              title="Italic (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive('underline')}
              onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
              className="h-8 w-8 p-0"
              title="Underline (Ctrl+U)"
            >
              <UnderlineIcon className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive('strike')}
              onPressedChange={() => editor.chain().focus().toggleStrike().run()}
              className="h-8 w-8 p-0"
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive('highlight')}
              onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
              className="h-8 w-8 p-0"
              title="Highlight"
            >
              <Highlighter className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive('code')}
              onPressedChange={() => editor.chain().focus().toggleCode().run()}
              className="h-8 w-8 p-0"
              title="Inline Code"
            >
              <Code className="h-4 w-4" />
            </Toggle>
          </div>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Headings */}
          <div className="flex items-center gap-0.5">
            <Toggle
              size="sm"
              pressed={editor.isActive('paragraph')}
              onPressedChange={() => editor.chain().focus().setParagraph().run()}
              className="h-8 w-8 p-0"
              title="Paragraph"
            >
              <Pilcrow className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive('heading', { level: 1 })}
              onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className="h-8 w-8 p-0"
              title="Heading 1"
            >
              <Heading1 className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive('heading', { level: 2 })}
              onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className="h-8 w-8 p-0"
              title="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive('heading', { level: 3 })}
              onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className="h-8 w-8 p-0"
              title="Heading 3"
            >
              <Heading3 className="h-4 w-4" />
            </Toggle>
          </div>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Lists */}
          <div className="flex items-center gap-0.5">
            <Toggle
              size="sm"
              pressed={editor.isActive('bulletList')}
              onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
              className="h-8 w-8 p-0"
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive('orderedList')}
              onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
              className="h-8 w-8 p-0"
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive('taskList')}
              onPressedChange={() => editor.chain().focus().toggleTaskList().run()}
              className="h-8 w-8 p-0"
              title="Task List"
            >
              <ListChecks className="h-4 w-4" />
            </Toggle>
          </div>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Blocks */}
          <div className="flex items-center gap-0.5">
            <Toggle
              size="sm"
              pressed={editor.isActive('blockquote')}
              onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
              className="h-8 w-8 p-0"
              title="Quote"
            >
              <Quote className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive('codeBlock')}
              onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
              className="h-8 w-8 p-0"
              title="Code Block"
            >
              <Code2 className="h-4 w-4" />
            </Toggle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="h-8 w-8 p-0"
              title="Horizontal Rule"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Media & Links */}
          <div className="flex items-center gap-0.5">
            <Toggle
              size="sm"
              pressed={editor.isActive('link')}
              onPressedChange={setLink}
              className="h-8 w-8 p-0"
              title="Add Link"
            >
              <LinkIcon className="h-4 w-4" />
            </Toggle>
            <Button
              variant="ghost"
              size="sm"
              onClick={addImage}
              className="h-8 w-8 p-0"
              title="Add Image"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Drag Handle Styles (US-WIKI-007) */}
      <style dangerouslySetInnerHTML={{ __html: dragHandleStyles }} />

      {/* Editor Content - with left padding for drag handle */}
      <div className="relative pl-8">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default TipTapEditor;

// US-WIKI-007 test
