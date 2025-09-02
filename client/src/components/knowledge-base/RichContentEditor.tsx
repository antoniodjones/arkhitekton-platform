import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { createLowlight } from 'lowlight';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Code, 
  Quote, 
  List, 
  ListOrdered, 
  CheckSquare,
  Table as TableIcon, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Minus,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  FileCode,
  Network
} from 'lucide-react';

interface RichContentEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
}

export function RichContentEditor({ 
  content = '', 
  onChange, 
  placeholder = 'Start writing...', 
  className,
  readOnly = false,
  autoFocus = false
}: RichContentEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [mermaidCode, setMermaidCode] = useState('');
  
  const lowlight = createLowlight();
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We'll use CodeBlockLowlight instead
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'typescript',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-emerald-600 hover:text-emerald-700 underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg shadow-md',
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content,
    editable: !readOnly,
    autofocus: autoFocus,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  const addLink = useCallback(() => {
    if (!linkUrl) return;
    
    editor?.chain().focus().setLink({ href: linkUrl }).run();
    setLinkUrl('');
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    if (!imageUrl) return;
    
    editor?.chain().focus().setImage({ src: imageUrl }).run();
    setImageUrl('');
  }, [editor, imageUrl]);

  const insertTable = useCallback(() => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const addMermaidDiagram = useCallback(() => {
    if (!mermaidCode) return;
    
    // Insert Mermaid diagram as a code block with mermaid language
    editor?.chain().focus().setCodeBlock({ language: 'mermaid' }).insertContent(mermaidCode).run();
    setMermaidCode('');
  }, [editor, mermaidCode]);

  if (!editor) {
    return null;
  }

  return (
    <Card className={`w-full ${className}`}>
      {!readOnly && (
        <CardContent className="p-4 border-b">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-1">
            {/* Text Formatting */}
            <div className="flex items-center gap-1">
              <Button
                variant={editor.isActive('bold') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                data-testid="button-bold"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant={editor.isActive('italic') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                data-testid="button-italic"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant={editor.isActive('strike') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                data-testid="button-strikethrough"
              >
                <Strikethrough className="h-4 w-4" />
              </Button>
              <Button
                variant={editor.isActive('code') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleCode().run()}
                data-testid="button-inline-code"
              >
                <Code className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Heading Levels */}
            <Select
              value={
                editor.isActive('heading', { level: 1 }) ? '1' :
                editor.isActive('heading', { level: 2 }) ? '2' :
                editor.isActive('heading', { level: 3 }) ? '3' :
                'paragraph'
              }
              onValueChange={(value) => {
                if (value === 'paragraph') {
                  editor.chain().focus().setParagraph().run();
                } else {
                  editor.chain().focus().toggleHeading({ level: parseInt(value) as 1 | 2 | 3 }).run();
                }
              }}
            >
              <SelectTrigger className="w-32" data-testid="select-heading">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paragraph">Paragraph</SelectItem>
                <SelectItem value="1">Heading 1</SelectItem>
                <SelectItem value="2">Heading 2</SelectItem>
                <SelectItem value="3">Heading 3</SelectItem>
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-6" />

            {/* Lists */}
            <div className="flex items-center gap-1">
              <Button
                variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                data-testid="button-bullet-list"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                data-testid="button-ordered-list"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button
                variant={editor.isActive('taskList') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleTaskList().run()}
                data-testid="button-task-list"
              >
                <CheckSquare className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Block Elements */}
            <div className="flex items-center gap-1">
              <Button
                variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                data-testid="button-blockquote"
              >
                <Quote className="h-4 w-4" />
              </Button>
              <Button
                variant={editor.isActive('codeBlock') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                data-testid="button-code-block"
              >
                <FileCode className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                data-testid="button-horizontal-rule"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Table */}
            <Button
              variant="ghost"
              size="sm"
              onClick={insertTable}
              data-testid="button-insert-table"
            >
              <TableIcon className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-6" />

            {/* Media & Links */}
            <div className="flex items-center gap-1">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" data-testid="button-add-link">
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Link</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Enter URL..."
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      data-testid="input-link-url"
                    />
                    <Button onClick={addLink} className="w-full" data-testid="button-confirm-link">
                      Add Link
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" data-testid="button-add-image">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Image</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Enter image URL..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      data-testid="input-image-url"
                    />
                    <Button onClick={addImage} className="w-full" data-testid="button-confirm-image">
                      Add Image
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" data-testid="button-add-diagram">
                    <Network className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Mermaid Diagram</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <textarea
                      className="w-full h-40 p-3 border rounded-md font-mono text-sm"
                      placeholder={`graph TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Action]\n    B -->|No| D[End]\n    C --> D`}
                      value={mermaidCode}
                      onChange={(e) => setMermaidCode(e.target.value)}
                      data-testid="textarea-mermaid-code"
                    />
                    <Button onClick={addMermaidDiagram} className="w-full" data-testid="button-confirm-diagram">
                      Add Diagram
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Undo/Redo */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                data-testid="button-undo"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                data-testid="button-redo"
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
      
      <CardContent className="p-4">
        <EditorContent 
          editor={editor} 
          className={`
            prose prose-slate max-w-none min-h-[400px]
            prose-headings:text-slate-900 dark:prose-headings:text-white prose-headings:leading-tight prose-headings:mb-1 prose-headings:mt-1
            prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-tight prose-p:mb-1 prose-p:mt-0
            prose-strong:text-slate-900 dark:prose-strong:text-white
            prose-code:text-emerald-700 dark:prose-code:text-emerald-400
            prose-code:bg-slate-100 dark:prose-code:bg-slate-800
            prose-pre:bg-slate-900 dark:prose-pre:bg-slate-950
            prose-blockquote:border-emerald-500
            prose-blockquote:text-slate-600 dark:prose-blockquote:text-slate-400
            prose-li:leading-tight prose-li:mb-0 prose-li:mt-0
            prose-ul:mb-1 prose-ul:mt-1 prose-ol:mb-1 prose-ol:mt-1
            focus-within:outline-none leading-tight
            ${readOnly ? 'cursor-default' : 'cursor-text'}
          `}
          style={{ 
            lineHeight: '1.1',
            fontSize: '14px',
            fontWeight: '300'
          }}
          data-testid="editor-content"
        />
      </CardContent>
    </Card>
  );
}