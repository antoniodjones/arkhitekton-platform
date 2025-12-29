'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import { Color } from '@tiptap/extension-color';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { createMentionExtension } from './mention-extension';
import { BlockMoveButtons } from './block-move-buttons';
import { 
  FontSizeExtension, 
  LineHeightExtension, 
  TextAlignExtension, 
  IndentExtension,
  SubscriptExtension,
  SuperscriptExtension 
} from './extensions';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
  Pilcrow,
  ChevronDown,
  Type,
  ALargeSmall,
  ListCollapse,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
  Subscript,
  Superscript,
  CaseSensitive,
  RemoveFormatting,
  Paintbrush,
  Sparkles
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

// Font size options for dropdown
const FONT_SIZES = [
  '8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '72'
];

// Style presets for quick formatting
const STYLE_PRESETS = [
  { name: 'Normal', fontSize: '16px', fontWeight: 'normal', color: null },
  { name: 'Title', fontSize: '28px', fontWeight: 'bold', color: null },
  { name: 'Heading 1', fontSize: '24px', fontWeight: 'bold', color: null },
  { name: 'Heading 2', fontSize: '20px', fontWeight: 'bold', color: null },
  { name: 'Subtitle', fontSize: '14px', fontWeight: 'normal', color: '#666666' },
  { name: 'Quote', fontSize: '14px', fontWeight: 'normal', color: '#666666', italic: true },
  { name: 'Code', fontSize: '13px', fontWeight: 'normal', color: '#d63384', fontFamily: 'Courier New' },
];

// Highlight colors
const HIGHLIGHT_COLORS = [
  { name: 'Yellow', color: '#fef08a' },
  { name: 'Green', color: '#bbf7d0' },
  { name: 'Blue', color: '#bfdbfe' },
  { name: 'Pink', color: '#fbcfe8' },
  { name: 'Orange', color: '#fed7aa' },
  { name: 'Purple', color: '#e9d5ff' },
  { name: 'Red', color: '#fecaca' },
  { name: 'Cyan', color: '#a5f3fc' },
];

export function TipTapEditor({
  content,
  onChange,
  placeholder = 'Start writing your documentation...',
  editable = true,
  className
}: TipTapEditorProps) {
  // Format painter state
  const [formatPainterActive, setFormatPainterActive] = useState(false);
  const [storedFormat, setStoredFormat] = useState<Record<string, any> | null>(null);

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
      // Text styling extensions (ported from Google Docs clone)
      TextStyle,
      FontFamily,
      Color,
      FontSizeExtension,
      LineHeightExtension,
      TextAlignExtension,
      IndentExtension,
      SubscriptExtension,
      SuperscriptExtension,
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-zinc-900 text-zinc-100 rounded-lg p-4 font-mono text-sm overflow-x-auto',
        },
      }),
      // @mention extension for semantic linking
      createMentionExtension(),
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

  // Update editable state when prop changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  // Editor ref for drag handle positioning
  const editorRef = useRef<HTMLDivElement>(null);

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

  // Format Painter: Copy current formatting
  const copyFormat = useCallback(() => {
    if (!editor) return;
    
    const attrs = editor.getAttributes('textStyle');
    const marks = {
      bold: editor.isActive('bold'),
      italic: editor.isActive('italic'),
      underline: editor.isActive('underline'),
      strike: editor.isActive('strike'),
      highlight: editor.isActive('highlight'),
      subscript: editor.isActive('subscript'),
      superscript: editor.isActive('superscript'),
      ...attrs,
    };
    
    setStoredFormat(marks);
    setFormatPainterActive(true);
  }, [editor]);

  // Format Painter: Apply stored formatting
  const applyFormat = useCallback(() => {
    if (!editor || !storedFormat) return;
    
    let chain = editor.chain().focus();
    
    // Apply text style attributes
    if (storedFormat.fontSize) {
      chain = chain.setFontSize(storedFormat.fontSize);
    }
    if (storedFormat.fontFamily) {
      chain = chain.setFontFamily(storedFormat.fontFamily);
    }
    if (storedFormat.color) {
      chain = chain.setColor(storedFormat.color);
    }
    
    // Apply marks
    if (storedFormat.bold) chain = chain.setBold();
    else chain = chain.unsetBold();
    
    if (storedFormat.italic) chain = chain.setItalic();
    else chain = chain.unsetItalic();
    
    if (storedFormat.underline) chain = chain.setUnderline();
    else chain = chain.unsetUnderline();
    
    if (storedFormat.strike) chain = chain.setStrike();
    else chain = chain.unsetStrike();
    
    if (storedFormat.highlight) chain = chain.setHighlight();
    else chain = chain.unsetHighlight();
    
    if (storedFormat.subscript) chain = chain.setSubscript();
    else chain = chain.unsetSubscript();
    
    if (storedFormat.superscript) chain = chain.setSuperscript();
    else chain = chain.unsetSuperscript();
    
    chain.run();
    setFormatPainterActive(false);
  }, [editor, storedFormat]);

  // Change Case function
  const changeCase = useCallback((caseType: 'upper' | 'lower' | 'title' | 'sentence') => {
    if (!editor) return;
    
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, ' ');
    
    if (!text) return;
    
    let newText: string;
    switch (caseType) {
      case 'upper':
        newText = text.toUpperCase();
        break;
      case 'lower':
        newText = text.toLowerCase();
        break;
      case 'title':
        newText = text.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
        );
        break;
      case 'sentence':
        newText = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        break;
    }
    
    editor.chain().focus().insertContentAt({ from, to }, newText).run();
  }, [editor]);

  // Clear all formatting
  const clearFormatting = useCallback(() => {
    if (!editor) return;
    
    editor.chain()
      .focus()
      .unsetAllMarks()
      .clearNodes()
      .unsetFontSize()
      .unsetFontFamily()
      .unsetColor()
      .unsetTextAlign()
      .unsetIndent()
      .run();
  }, [editor]);

  // Apply style preset
  const applyStylePreset = useCallback((preset: typeof STYLE_PRESETS[0]) => {
    if (!editor) return;
    
    let chain = editor.chain().focus();
    
    // Clear existing formatting first
    chain = chain.unsetAllMarks();
    
    // Apply preset styles
    if (preset.fontSize) {
      chain = chain.setFontSize(preset.fontSize);
    }
    if (preset.fontFamily) {
      chain = chain.setFontFamily(preset.fontFamily);
    }
    if (preset.color) {
      chain = chain.setColor(preset.color);
    }
    if (preset.fontWeight === 'bold') {
      chain = chain.setBold();
    }
    if ((preset as any).italic) {
      chain = chain.setItalic();
    }
    
    chain.run();
  }, [editor]);

  // Handle click when format painter is active
  useEffect(() => {
    if (!editor || !formatPainterActive) return;
    
    const handleSelectionUpdate = () => {
      if (formatPainterActive && !editor.state.selection.empty) {
        applyFormat();
      }
    };
    
    editor.on('selectionUpdate', handleSelectionUpdate);
    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor, formatPainterActive, applyFormat]);

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

          {/* Format Painter */}
          <Toggle
            size="sm"
            pressed={formatPainterActive}
            onPressedChange={() => {
              if (formatPainterActive) {
                setFormatPainterActive(false);
                setStoredFormat(null);
              } else {
                copyFormat();
              }
            }}
            className={cn("h-8 w-8 p-0", formatPainterActive && "bg-primary text-primary-foreground")}
            title="Format Painter (Click to copy format, then select text to apply)"
          >
            <Paintbrush className="h-4 w-4" />
          </Toggle>

          {/* Clear Formatting */}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFormatting}
            className="h-8 w-8 p-0"
            title="Clear Formatting"
          >
            <RemoveFormatting className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Style Presets */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2 gap-1 min-w-[80px] justify-between">
                <Sparkles className="h-3 w-3" />
                <span className="text-xs">Styles</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {STYLE_PRESETS.map((preset) => (
                <DropdownMenuItem
                  key={preset.name}
                  onClick={() => applyStylePreset(preset)}
                  style={{
                    fontSize: preset.fontSize,
                    fontWeight: preset.fontWeight,
                    color: preset.color || undefined,
                    fontStyle: (preset as any).italic ? 'italic' : undefined,
                    fontFamily: preset.fontFamily || undefined,
                  }}
                >
                  {preset.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Change Case */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
                <CaseSensitive className="h-4 w-4" />
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => changeCase('upper')}>
                UPPERCASE
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeCase('lower')}>
                lowercase
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeCase('title')}>
                Title Case
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeCase('sentence')}>
                Sentence case
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Font Family */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2 gap-1 min-w-[100px] justify-between">
                <span className="text-xs truncate">
                  {editor.getAttributes('textStyle').fontFamily || 'Default'}
                </span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {['Default', 'Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana'].map((font) => (
                <DropdownMenuItem
                  key={font}
                  onClick={() => font === 'Default' 
                    ? editor.chain().focus().unsetFontFamily().run()
                    : editor.chain().focus().setFontFamily(font).run()
                  }
                  style={{ fontFamily: font === 'Default' ? 'inherit' : font }}
                >
                  {font}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Font Size Dropdown */}
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-6 p-0"
              onClick={() => {
                const current = parseInt(editor.getAttributes('textStyle').fontSize || '16');
                if (current > 8) editor.chain().focus().setFontSize(`${current - 1}px`).run();
              }}
              title="Decrease Font Size"
            >
              <span className="text-xs">−</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-1 min-w-[40px]">
                  <span className="text-xs">
                    {editor.getAttributes('textStyle').fontSize?.replace('px', '') || '16'}
                  </span>
                  <ChevronDown className="h-3 w-3 ml-0.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-64 overflow-y-auto">
                {FONT_SIZES.map((size) => (
                  <DropdownMenuItem
                    key={size}
                    onClick={() => editor.chain().focus().setFontSize(`${size}px`).run()}
                    className={cn(
                      "cursor-pointer",
                      editor.getAttributes('textStyle').fontSize === `${size}px` && "bg-accent"
                    )}
                  >
                    {size}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-6 p-0"
              onClick={() => {
                const current = parseInt(editor.getAttributes('textStyle').fontSize || '16');
                if (current < 72) editor.chain().focus().setFontSize(`${current + 1}px`).run();
              }}
              title="Increase Font Size"
            >
              <span className="text-xs">+</span>
            </Button>
          </div>

          {/* Text Color */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Text Color">
                <div className="flex flex-col items-center">
                  <Type className="h-3 w-3" />
                  <div 
                    className="h-1 w-4 rounded-sm mt-0.5" 
                    style={{ backgroundColor: editor.getAttributes('textStyle').color || '#000000' }}
                  />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <div className="grid grid-cols-8 gap-1">
                {['#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#ffffff',
                  '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff',
                  '#9900ff', '#ff00ff', '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3',
                  '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc'].map((color) => (
                  <button
                    key={color}
                    className="h-5 w-5 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => editor.chain().focus().setColor(color).run()}
                  />
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 text-xs"
                onClick={() => editor.chain().focus().unsetColor().run()}
              >
                Remove Color
              </Button>
            </PopoverContent>
          </Popover>

          {/* Line Height */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Line Height">
                <ListCollapse className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {[
                { label: 'Single', value: '1' },
                { label: '1.15', value: '1.15' },
                { label: '1.5', value: '1.5' },
                { label: 'Double', value: '2' },
              ].map(({ label, value }) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => editor.chain().focus().setLineHeight(value).run()}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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
            {/* Highlight Color Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn("h-8 w-8 p-0", editor.isActive('highlight') && "bg-accent")}
                  title="Highlight Color"
                >
                  <div className="flex flex-col items-center">
                    <Highlighter className="h-3 w-3" />
                    <div 
                      className="h-1 w-4 rounded-sm mt-0.5" 
                      style={{ backgroundColor: editor.getAttributes('highlight').color || '#fef08a' }}
                    />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2">
                <div className="grid grid-cols-4 gap-1">
                  {HIGHLIGHT_COLORS.map(({ name, color }) => (
                    <button
                      key={color}
                      className={cn(
                        "h-6 w-6 rounded border hover:scale-110 transition-transform",
                        editor.getAttributes('highlight').color === color && "ring-2 ring-primary"
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
                      title={name}
                    />
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 text-xs"
                  onClick={() => editor.chain().focus().unsetHighlight().run()}
                >
                  Remove Highlight
                </Button>
              </PopoverContent>
            </Popover>
            <Toggle
              size="sm"
              pressed={editor.isActive('code')}
              onPressedChange={() => editor.chain().focus().toggleCode().run()}
              className="h-8 w-8 p-0"
              title="Inline Code"
            >
              <Code className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive('subscript')}
              onPressedChange={() => editor.chain().focus().toggleSubscript().run()}
              className="h-8 w-8 p-0"
              title="Subscript (Ctrl+,)"
            >
              <Subscript className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive('superscript')}
              onPressedChange={() => editor.chain().focus().toggleSuperscript().run()}
              className="h-8 w-8 p-0"
              title="Superscript (Ctrl+.)"
            >
              <Superscript className="h-4 w-4" />
            </Toggle>
          </div>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Text Alignment */}
          <div className="flex items-center gap-0.5">
            <Toggle
              size="sm"
              pressed={editor.getAttributes('paragraph').textAlign === 'left' || !editor.getAttributes('paragraph').textAlign}
              onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
              className="h-8 w-8 p-0"
              title="Align Left (Ctrl+Shift+L)"
            >
              <AlignLeft className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.getAttributes('paragraph').textAlign === 'center'}
              onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
              className="h-8 w-8 p-0"
              title="Align Center (Ctrl+Shift+E)"
            >
              <AlignCenter className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.getAttributes('paragraph').textAlign === 'right'}
              onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
              className="h-8 w-8 p-0"
              title="Align Right (Ctrl+Shift+R)"
            >
              <AlignRight className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.getAttributes('paragraph').textAlign === 'justify'}
              onPressedChange={() => editor.chain().focus().setTextAlign('justify').run()}
              className="h-8 w-8 p-0"
              title="Justify (Ctrl+Shift+J)"
            >
              <AlignJustify className="h-4 w-4" />
            </Toggle>
          </div>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Indent Controls */}
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().outdent().run()}
              className="h-8 w-8 p-0"
              title="Decrease Indent (Shift+Tab)"
            >
              <Outdent className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().indent().run()}
              className="h-8 w-8 p-0"
              title="Increase Indent (Tab)"
            >
              <Indent className="h-4 w-4" />
            </Button>
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

      {/* Editor Content - with left padding for move buttons */}
      <div ref={editorRef} className="relative pl-8">
        {/* Block Move Buttons (US-WIKI-007) */}
        <BlockMoveButtons editor={editor} editorRef={editorRef} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default TipTapEditor;

// US-WIKI-007 test
