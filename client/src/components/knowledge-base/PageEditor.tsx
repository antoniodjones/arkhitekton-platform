import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { RichContentEditor } from './RichContentEditor';
import { apiRequest } from '@/lib/queryClient';
import { Save, X, Plus, Tag } from 'lucide-react';
import type { KnowledgeBasePage, InsertKnowledgeBasePage } from '@shared/schema';

interface PageEditorProps {
  pageId?: string;
  parentId?: string;
  isOpen?: boolean;
  onClose?: () => void;
  onSave?: (page: KnowledgeBasePage) => void;
  onCancel?: () => void;
  autoFocus?: boolean;
  inline?: boolean;
  className?: string;
}

const CATEGORIES = [
  'Governance',
  'Standards', 
  'Procedures',
  'Templates',
  'Best Practices',
  'Architecture Patterns',
  'Technical Guides',
  'Business Rules'
];

const STATUSES = [
  'Draft',
  'Under Review',
  'Published',
  'Archived'
];

export function PageEditor({ 
  pageId, 
  parentId, 
  isOpen = true, 
  onClose, 
  onSave, 
  onCancel,
  autoFocus = false,
  inline = false,
  className 
}: PageEditorProps) {
  const [title, setTitle] = useState(inline ? 'Untitled' : '');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('Draft');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [order, setOrder] = useState(0);
  const [pageCreated, setPageCreated] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Auto-save for inline editing
  const autoSave = useCallback(async () => {
    if (!inline || (!title.trim() && !content.trim())) return;
    
    const pageData = {
      title: title.trim() || 'Untitled',
      content: typeof content === 'string' ? content : JSON.stringify(content),
      category: category || "Governance",
      status: status || "Draft",
      tags: tags || [],
      parentPageId: parentId || null,
      order: order || 0,
    };

    try {
      if (pageId && pageId !== 'new-page') {
        await apiRequest('PUT', `/api/knowledge-base/pages/${pageId}`, pageData);
      } else if (!pageCreated) {
        const response = await apiRequest('POST', '/api/knowledge-base/pages', pageData as InsertKnowledgeBasePage);
        const newPage = await response.json();
        setPageCreated(true);
        queryClient.invalidateQueries({ queryKey: ['/api/knowledge-base/pages'] });
        if (onSave) {
          onSave(newPage);
        }
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [inline, title, content, category, status, tags, parentId, order, pageId, pageCreated, queryClient, onSave]);

  // Debounced auto-save
  useEffect(() => {
    if (!inline) return;

    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    const timer = setTimeout(() => {
      autoSave();
    }, 2000); // Auto-save after 2 seconds of inactivity

    setAutoSaveTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [title, content, category, status, autoSave, inline]);

  // Fetch existing page data if editing
  const { data: existingPage } = useQuery({
    queryKey: ['/api/knowledge-base/pages', pageId],
    enabled: !!pageId && isOpen,
  });

  // Load existing page data when editing
  useEffect(() => {
    if (existingPage) {
      setTitle(existingPage.title);
      setSlug(existingPage.slug);
      setContent(existingPage.content || '');
      setCategory(existingPage.category || '');
      setStatus(existingPage.status || 'Draft');
      setTags(existingPage.tags || []);
      setOrder(existingPage.order || 0);
    }
  }, [existingPage]);

  // Generate slug from title
  useEffect(() => {
    if (title && !pageId) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  }, [title, pageId]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setSlug('');
      setContent('');
      setCategory('');
      setStatus('Draft');
      setTags([]);
      setNewTag('');
      setOrder(0);
    }
  }, [isOpen]);

  const createPageMutation = useMutation({
    mutationFn: async (data: InsertKnowledgeBasePage) => {
      return apiRequest('/api/knowledge-base/pages', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/knowledge-base/pages'] });
      toast({
        title: 'Success',
        description: 'Knowledge base page created successfully',
      });
      onSave?.(data);
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create page. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const updatePageMutation = useMutation({
    mutationFn: async (data: Partial<KnowledgeBasePage>) => {
      return apiRequest(`/api/knowledge-base/pages/${pageId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/knowledge-base/pages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/knowledge-base/pages', pageId] });
      toast({
        title: 'Success',
        description: 'Knowledge base page updated successfully',
      });
      onSave?.(data);
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update page. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Page title is required',
        variant: 'destructive',
      });
      return;
    }

    if (!slug.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Page slug is required',
        variant: 'destructive',
      });
      return;
    }

    const pageData = {
      title: title.trim(),
      slug: slug.trim() || undefined, // Let backend auto-generate if empty
      content: typeof content === 'string' ? content : JSON.stringify(content),
      category: category || "General",
      status: status || "draft",
      tags: tags || [],
      parentPageId: parentId || null,
      order: order || 0,
    };

    if (pageId) {
      updatePageMutation.mutate(pageData);
    } else {
      createPageMutation.mutate(pageData as InsertKnowledgeBasePage);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const isLoading = createPageMutation.isPending || updatePageMutation.isPending;

  // Confluence-style inline editor
  if (inline) {
    return (
      <div className={`h-full overflow-y-auto ${className || ''}`}>
        <div className="space-y-6">
          {/* Confluence-style title */}
          <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
            <input
              className="text-4xl font-bold bg-transparent border-none outline-none text-slate-600 dark:text-slate-300 w-full placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="Give this page a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus={autoFocus}
              data-testid="input-page-title-inline"
            />
          </div>

          {/* Quick metadata */}
          <div className="flex gap-4 text-sm">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((stat) => (
                  <SelectItem key={stat} value={stat}>
                    {stat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rich Content Editor */}
          <RichContentEditor
            content={content}
            onChange={setContent}
            placeholder="Type / to insert elements"
            className="min-h-[400px] border-none"
          />

          {/* Auto-save indicator */}
          <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 pt-4 border-t">
            <span>Auto-save: {isLoading ? 'Saving...' : 'Saved'}</span>
            <div className="flex gap-2">
              {onCancel && (
                <Button variant="outline" size="sm" onClick={onCancel}>
                  Discard
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{pageId ? 'Edit Page' : 'Create New Page'}</span>
            <Button variant="ghost" size="sm" onClick={onClose} data-testid="button-close-editor">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* Page Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter page title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                data-testid="input-page-title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                placeholder="page-url-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                data-testid="input-page-slug"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger data-testid="select-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger data-testid="select-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((stat) => (
                    <SelectItem key={stat} value={stat}>
                      {stat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                placeholder="0"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                data-testid="input-page-order"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  <Tag className="h-3 w-3" />
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeTag(tag)}
                    data-testid={`button-remove-tag-${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                data-testid="input-new-tag"
              />
              <Button variant="outline" onClick={addTag} data-testid="button-add-tag">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Rich Content Editor */}
          <div className="space-y-2">
            <Label>Content</Label>
            <RichContentEditor
              content={content}
              onChange={setContent}
              placeholder="Write your knowledge base page content..."
              className="min-h-[500px]"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isLoading} data-testid="button-cancel">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading} data-testid="button-save-page">
            {isLoading ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {pageId ? 'Update Page' : 'Create Page'}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}