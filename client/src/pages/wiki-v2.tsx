'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useRoute } from 'wouter';
import { AppLayout } from '@/components/layout/app-layout';
import { WikiTree } from '@/components/wiki/wiki-tree';
import { WikiBreadcrumb } from '@/components/wiki/wiki-breadcrumb';
import { TipTapEditor } from '@/components/wiki/tiptap-editor';
import { BacklinksPanel } from '@/components/wiki/backlinks-panel';
import { MentionPreview, useMentionPreview } from '@/components/wiki/mention-preview';
import { FloatingActionToolbar } from '@/components/wiki/floating-action-toolbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import {
  Plus,
  Save,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  User,
  Tag,
  FileText,
  Search,
  Filter,
  LayoutGrid,
  List,
  BookOpen,
  Settings,
  MoreVertical,
  X,
  Copy,
  Check,
  Archive,
  Send,
  Printer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface WikiPage {
  id: string;
  title: string;
  content: any;
  parentId: string | null;
  path: string | null;
  sortOrder: number;
  category: string | null;
  subcategory: string | null;
  template: string | null;
  status: string;
  createdBy: string;
  updatedBy: string | null;
  contributors: string[];
  views: number;
  likes: number;
  tags: string[];
  metadata: Record<string, any>;
  version: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

const CATEGORIES = [
  'Architecture',
  'Governance',
  'Standards',
  'Procedures',
  'Templates',
  'Best Practices',
  'Architecture Patterns'
];

const TEMPLATES = [
  { value: 'ADR', label: 'Architecture Decision Record' },
  { value: 'Design', label: 'Design Document' },
  { value: 'Requirement', label: 'Requirement Specification' },
  { value: 'Meeting', label: 'Meeting Notes' },
  { value: 'RFC', label: 'Request for Comments' },
  { value: 'Business_Case', label: 'Business Case' },
  { value: 'Runbook', label: 'Runbook' },
  { value: 'Onboarding', label: 'Onboarding Guide' },
];

export default function WikiV2Page() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/wiki-v2/:id');
  const pageId = params?.id;

  // State
  const [selectedPage, setSelectedPage] = useState<WikiPage | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<any>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createParentId, setCreateParentId] = useState<string | null>(null);
  const [newPage, setNewPage] = useState({
    title: '',
    category: '',
    template: '',
    status: 'draft',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<WikiPage | null>(null);
  const [draftStatus, setDraftStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [showDraftRestore, setShowDraftRestore] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<any>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const lastSavedContent = useRef<any>(null);
  const currentContentRef = useRef<any>(null);

  // Mention preview state
  const { previewState, showPreview, hidePreview } = useMentionPreview();

  // Fetch single page when ID is in URL
  const { data: currentPage, isLoading: isLoadingPage } = useQuery({
    queryKey: ['/api/wiki', pageId],
    queryFn: async () => {
      if (!pageId) return null;
      const response = await fetch(`/api/wiki/${pageId}`);
      if (!response.ok) throw new Error('Failed to fetch page');
      const result = await response.json();
      return result.data as WikiPage;
    },
    enabled: !!pageId,
  });

  // Fetch draft for current page (US-WIKI-002)
  const { data: draftData } = useQuery({
    queryKey: ['/api/wiki', pageId, 'draft'],
    queryFn: async () => {
      if (!pageId) return null;
      const response = await fetch(`/api/wiki/${pageId}/draft`);
      if (!response.ok) return null;
      const result = await response.json();
      return result.draft;
    },
    enabled: !!pageId,
  });

  // Update selected page when URL changes and check for draft
  useEffect(() => {
    if (currentPage) {
      setSelectedPage(currentPage);
      setEditedTitle(currentPage.title);
      setEditedContent(currentPage.content);
      lastSavedContent.current = currentPage.content;
      currentContentRef.current = currentPage.content;
      
      // Check if there's a draft that differs from saved content (US-WIKI-002)
      if (draftData) {
        const savedContentStr = JSON.stringify(currentPage.content);
        const draftContentStr = JSON.stringify(draftData);
        if (savedContentStr !== draftContentStr) {
          setPendingDraft(draftData);
          setShowDraftRestore(true);
        }
      }
    }
  }, [currentPage, draftData]);

  // Build breadcrumb trail
  const { data: allPages } = useQuery({
    queryKey: ['/api/wiki'],
    queryFn: async () => {
      const response = await fetch('/api/wiki');
      if (!response.ok) throw new Error('Failed to fetch pages');
      const result = await response.json();
      return result.data as WikiPage[];
    },
  });

  // Debounce search query (US-WIKI-005)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Full-text search query (US-WIKI-005)
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['/api/wiki/search', debouncedSearchQuery],
    queryFn: async () => {
      if (!debouncedSearchQuery.trim()) return null;
      const response = await fetch(`/api/wiki/search?q=${encodeURIComponent(debouncedSearchQuery)}`);
      if (!response.ok) throw new Error('Failed to search');
      const result = await response.json();
      return result.data as WikiPage[];
    },
    enabled: !!debouncedSearchQuery.trim(),
  });

  const getBreadcrumbs = useCallback((page: WikiPage | null): { id: string; title: string }[] => {
    if (!page || !allPages) return [];
    
    const breadcrumbs: { id: string; title: string }[] = [];
    let current: WikiPage | undefined = page;
    
    while (current) {
      breadcrumbs.unshift({ id: current.id, title: current.title });
      current = allPages.find(p => p.id === current?.parentId);
    }
    
    return breadcrumbs;
  }, [allPages]);

  // Create page mutation
  const createPageMutation = useMutation({
    mutationFn: async (pageData: any) => {
      const response = await fetch('/api/wiki', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageData),
      });
      if (!response.ok) throw new Error('Failed to create page');
      const result = await response.json();
      return result.data;
    },
    onSuccess: (page) => {
      queryClient.invalidateQueries({ queryKey: ['/api/wiki'] });
      toast({ title: 'Page created', description: `"${page.title}" has been created.` });
      setShowCreateDialog(false);
      setNewPage({ title: '', category: '', template: '', status: 'draft' });
      setLocation(`/wiki-v2/${page.id}`);
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Update page mutation
  const updatePageMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const response = await fetch(`/api/wiki/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update page');
      const result = await response.json();
      return result.data;
    },
    onSuccess: (page) => {
      queryClient.invalidateQueries({ queryKey: ['/api/wiki'] });
      queryClient.invalidateQueries({ queryKey: ['/api/wiki', page.id] });
      toast({ title: 'Saved', description: 'Changes have been saved.' });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Delete page mutation
  const deletePageMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/wiki/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete page');
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['/api/wiki'] });
      toast({ title: 'Deleted', description: 'Page has been deleted.' });
      setShowDeleteConfirm(false);
      setPageToDelete(null);
      if (selectedPage?.id === id) {
        setSelectedPage(null);
        setLocation('/wiki-v2');
      }
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Duplicate page mutation
  const duplicatePageMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/wiki/${id}/duplicate`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to duplicate page');
      const result = await response.json();
      return result.data;
    },
    onSuccess: (page) => {
      queryClient.invalidateQueries({ queryKey: ['/api/wiki'] });
      toast({ title: 'Duplicated', description: `"${page.title}" has been created.` });
      setLocation(`/wiki-v2/${page.id}`);
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Auto-save draft mutation (US-WIKI-001)
  const saveDraftMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: any }) => {
      const response = await fetch(`/api/wiki/${id}/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error('Failed to save draft');
      return response.json();
    },
    onSuccess: () => {
      lastSavedContent.current = currentContentRef.current;
      setDraftStatus('saved');
    },
    onError: () => {
      setDraftStatus('unsaved');
    },
  });

  // Auto-save effect - saves draft every 30 seconds when editing and content changed
  useEffect(() => {
    if (!isEditing || !selectedPage) return;

    const autoSaveInterval = setInterval(() => {
      // Check if content has changed since last save
      const currentContent = JSON.stringify(currentContentRef.current);
      const lastSaved = JSON.stringify(lastSavedContent.current);

      if (currentContent !== lastSaved) {
        setDraftStatus('saving');
        saveDraftMutation.mutate({
          id: selectedPage.id,
          content: currentContentRef.current,
        });
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [isEditing, selectedPage, saveDraftMutation]);

  // Track content changes for unsaved indicator
  useEffect(() => {
    if (!isEditing) return;
    
    const currentContent = JSON.stringify(currentContentRef.current);
    const lastSaved = JSON.stringify(lastSavedContent.current);
    
    if (currentContent !== lastSaved && draftStatus === 'saved') {
      setDraftStatus('unsaved');
    }
  }, [editedContent, isEditing, draftStatus]);

  // Handlers
  const handlePageSelect = useCallback((page: WikiPage) => {
    setLocation(`/wiki-v2/${page.id}`);
    setIsEditing(false);
  }, [setLocation]);

  const handleCreatePage = useCallback((parentId?: string) => {
    setCreateParentId(parentId || null);
    setShowCreateDialog(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!selectedPage) return;
    updatePageMutation.mutate({
      id: selectedPage.id,
      updates: {
        title: editedTitle,
        content: editedContent,
      },
    }, {
      onSuccess: () => {
        lastSavedContent.current = editedContent;
        setDraftStatus('saved');
      }
    });
  }, [selectedPage, editedTitle, editedContent, updatePageMutation]);

  const handlePublish = useCallback(() => {
    if (!selectedPage) return;
    updatePageMutation.mutate({
      id: selectedPage.id,
      updates: {
        status: 'published',
        title: editedTitle,
        content: editedContent,
      },
    });
  }, [selectedPage, editedTitle, editedContent, updatePageMutation]);

  const handlePrint = useCallback(() => {
    // Add wiki-print-mode class to enable wiki-specific print styles
    document.body.classList.add('wiki-print-mode');
    
    // Trigger print dialog
    window.print();
    
    // Remove the class after printing (with delay to ensure styles are applied)
    setTimeout(() => {
      document.body.classList.remove('wiki-print-mode');
    }, 1000);
    
    toast({
      title: 'Print Page',
      description: 'Opening print dialog...',
    });
  }, [toast]);

  const handleDeletePage = useCallback((page: WikiPage) => {
    setPageToDelete(page);
    setShowDeleteConfirm(true);
  }, []);

  const handleDuplicatePage = useCallback((page: WikiPage) => {
    duplicatePageMutation.mutate(page.id);
  }, [duplicatePageMutation]);

  // Restore draft handler (US-WIKI-002)
  const handleRestoreDraft = useCallback(() => {
    if (pendingDraft && selectedPage) {
      setEditedContent(pendingDraft);
      currentContentRef.current = pendingDraft;
      setIsEditing(true);
      setDraftStatus('unsaved');
      setShowDraftRestore(false);
      setPendingDraft(null);
      toast({ title: 'Draft restored', description: 'Your unsaved changes have been restored.' });
    }
  }, [pendingDraft, selectedPage, toast]);

  // Discard draft handler (US-WIKI-002)
  const handleDiscardDraft = useCallback(async () => {
    if (selectedPage) {
      // Clear the draft from the server
      try {
        await fetch(`/api/wiki/${selectedPage.id}/draft`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: null }),
        });
      } catch (error) {
        console.error('Failed to clear draft:', error);
      }
      setShowDraftRestore(false);
      setPendingDraft(null);
      toast({ title: 'Draft discarded', description: 'The unsaved draft has been removed.' });
    }
  }, [selectedPage, toast]);

  const handleCreateSubmit = useCallback(() => {
    createPageMutation.mutate({
      title: newPage.title,
      content: { type: 'doc', content: [{ type: 'paragraph' }] },
      parentId: createParentId,
      category: newPage.category || null,
      template: newPage.template || null,
      status: newPage.status,
      createdBy: 'system', // Will be replaced with actual user
    });
  }, [newPage, createParentId, createPageMutation]);

  // Keyboard shortcuts listener (US-WIKI-006)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd+/ or Ctrl+/ - Show shortcuts reference
      if ((event.metaKey || event.ctrlKey) && event.key === '/') {
        event.preventDefault();
        setShowShortcuts(true);
      }
      // Cmd+S or Ctrl+S - Save (when editing)
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault();
        if (isEditing && selectedPage) {
          handleSave();
        }
      }
      // Cmd+E or Ctrl+E - Toggle edit mode
      if ((event.metaKey || event.ctrlKey) && event.key === 'e') {
        event.preventDefault();
        if (selectedPage) {
          setIsEditing(!isEditing);
        }
      }
      // Escape - Cancel edit or close search
      if (event.key === 'Escape') {
        if (searchQuery) {
          setSearchQuery('');
          setDebouncedSearchQuery('');
        } else if (isEditing) {
          setIsEditing(false);
          setDraftStatus('saved');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, selectedPage, handleSave, searchQuery]);

  // Effect to handle mention hover and click events in the editor
  useEffect(() => {
    const handleMentionHover = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const mention = target.closest('[data-type="mention"]') as HTMLElement;
      
      if (mention) {
        const entityType = mention.getAttribute('data-entity-type');
        const entityId = mention.getAttribute('data-id');
        const rect = mention.getBoundingClientRect();
        
        if (entityType && entityId) {
          showPreview(entityType, entityId, rect.left, rect.bottom + 8);
        }
      }
    };

    const handleMentionLeave = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('[data-type="mention"]')) {
        hidePreview();
      }
    };

    const handleMentionClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const mention = target.closest('[data-type="mention"]') as HTMLElement;
      
      if (mention) {
        const url = mention.getAttribute('data-url');
        if (url) {
          event.preventDefault();
          setLocation(url);
        }
      }
    };

    document.addEventListener('mouseover', handleMentionHover);
    document.addEventListener('mouseout', handleMentionLeave);
    document.addEventListener('click', handleMentionClick);

    return () => {
      document.removeEventListener('mouseover', handleMentionHover);
      document.removeEventListener('mouseout', handleMentionLeave);
      document.removeEventListener('click', handleMentionClick);
    };
  }, [showPreview, hidePreview, setLocation]);

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b bg-background shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-amber-600" />
              <h1 className="text-xl font-semibold">Knowledge Core</h1>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <WikiBreadcrumb items={getBreadcrumbs(selectedPage)} />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-9"
              />
              {/* Search Results Dropdown (US-WIKI-005) */}
              {debouncedSearchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-80 overflow-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-muted-foreground">
                      <span className="animate-pulse">Searching...</span>
                    </div>
                  ) : searchResults && searchResults.length > 0 ? (
                    <div className="py-1">
                      <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground border-b">
                        {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{debouncedSearchQuery}"
                      </div>
                      {searchResults.map((page) => (
                        <button
                          key={page.id}
                          onClick={() => {
                            setLocation(`/wiki-v2/${page.id}`);
                            setSearchQuery('');
                            setDebouncedSearchQuery('');
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-muted flex items-center gap-2 transition-colors"
                        >
                          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div className="min-w-0">
                            <div className="font-medium truncate">{page.title}</div>
                            {page.category && (
                              <div className="text-xs text-muted-foreground truncate">
                                {page.category}
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No pages found for "{debouncedSearchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
            <Button onClick={() => handleCreatePage()} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New Page
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">
          {/* Tree Sidebar */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
            <div className="h-full border-r bg-muted/20 flex flex-col">
              <div className="p-3 border-b">
                <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Pages
                </h2>
              </div>
              <WikiTree
                selectedPageId={selectedPage?.id}
                onPageSelect={handlePageSelect}
                onCreatePage={handleCreatePage}
                onEditPage={(page) => {
                  setLocation(`/wiki-v2/${page.id}`);
                  setIsEditing(true);
                }}
                onDeletePage={handleDeletePage}
                onDuplicatePage={handleDuplicatePage}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Content Area */}
          <ResizablePanel defaultSize={80}>
            <ScrollArea className="h-full">
              {isLoadingPage && pageId ? (
                <div className="p-6 space-y-4">
                  <Skeleton className="h-10 w-2/3" />
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : selectedPage ? (
                <div className="p-6 max-w-4xl mx-auto">
                  {/* Draft Restore Banner (US-WIKI-002) */}
                  {showDraftRestore && pendingDraft && (
                    <div className="mb-6 p-4 rounded-lg border-2 border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-full">
                            <Archive className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-amber-800 dark:text-amber-200">
                              Unsaved draft found
                            </h4>
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                              You have an auto-saved draft from a previous session. Would you like to restore it?
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleDiscardDraft}
                            className="border-amber-300 text-amber-700 hover:bg-amber-100"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Discard
                          </Button>
                          <Button 
                            size="sm"
                            onClick={handleRestoreDraft}
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Restore Draft
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Page Header */}
                  <div className="mb-6">
                    <div className="flex items-start justify-between mb-2">
                      {isEditing ? (
                        <Input
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          className="text-3xl font-bold border-none p-0 h-auto focus-visible:ring-0 bg-transparent"
                          placeholder="Page title"
                        />
                      ) : (
                        <h1 className="text-3xl font-bold">{selectedPage.title}</h1>
                      )}
                      <div className="flex items-center gap-2">
                        {selectedPage.status === 'draft' && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            Draft
                          </Badge>
                        )}
                        {selectedPage.status === 'published' && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Published
                          </Badge>
                        )}
                        {isEditing ? (
                          <>
                            {/* Draft Status Indicator (US-WIKI-001) */}
                            {draftStatus === 'saving' && (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 animate-pulse">
                                Saving...
                              </Badge>
                            )}
                            {draftStatus === 'saved' && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Check className="h-3 w-3 mr-1" />
                                Saved
                              </Badge>
                            )}
                            {draftStatus === 'unsaved' && (
                              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                Unsaved changes
                              </Badge>
                            )}
                            <Button variant="outline" size="sm" onClick={() => {
                              setIsEditing(false);
                              setDraftStatus('saved');
                              // Reset content to last saved version
                              setEditedContent(lastSavedContent.current);
                              currentContentRef.current = lastSavedContent.current;
                            }}>
                              Cancel
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleSave} disabled={updatePageMutation.isPending}>
                              <Save className="h-4 w-4 mr-1" />
                              Save Draft
                            </Button>
                            <Button variant="outline" size="sm" onClick={handlePrint} title="Print Page">
                              <Printer className="h-4 w-4 mr-1" />
                              Print
                            </Button>
                            {selectedPage.status === 'draft' && (
                              <Button size="sm" onClick={handlePublish} disabled={updatePageMutation.isPending}>
                                <Send className="h-4 w-4 mr-1" />
                                Publish
                              </Button>
                            )}
                          </>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        {selectedPage.createdBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {format(new Date(selectedPage.updatedAt), 'MMM d, yyyy')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {selectedPage.views} views
                      </span>
                      {selectedPage.category && (
                        <Badge variant="secondary" className="text-xs">
                          {selectedPage.category}
                        </Badge>
                      )}
                      {selectedPage.template && (
                        <Badge variant="outline" className="text-xs">
                          {selectedPage.template}
                        </Badge>
                      )}
                    </div>

                    {/* Tags */}
                    {selectedPage.tags && selectedPage.tags.length > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                        {selectedPage.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator className="mb-6" />

                  {/* Backlinks Panel - shows pages that link to this page */}
                  <div className="mb-6 p-4 rounded-lg border bg-muted/20">
                    <BacklinksPanel
                      entityType="page"
                      entityId={selectedPage.id}
                      entityTitle={selectedPage.title}
                    />
                  </div>

                  {/* Editor */}
                  <TipTapEditor
                    key={selectedPage.id}
                    content={editedContent || selectedPage.content}
                    onChange={(content) => {
                      setEditedContent(content);
                      currentContentRef.current = content;
                    }}
                    editable={isEditing}
                    className="min-h-[400px]"
                  />

                  {/* Floating Action Toolbar (Google Docs style) */}
                  <FloatingActionToolbar
                    pageId={selectedPage.id}
                    pageTitle={selectedPage.title}
                    isEditing={isEditing}
                    hasUnsavedChanges={editedContent !== null && editedContent !== selectedPage.content}
                    isSaving={updatePageMutation.isPending}
                    onAIAssist={() => {
                      toast({
                        title: 'AI Assistant',
                        description: 'AI assistant is analyzing your page content...',
                      });
                    }}
                    onAddComment={() => {
                      toast({
                        title: 'Comments',
                        description: 'Select text and click again to add a comment.',
                      });
                    }}
                    onToggleEdit={() => {
                      if (isEditing) {
                        // Exiting edit mode - check for unsaved changes
                        if (editedContent !== null && editedContent !== selectedPage.content) {
                          if (confirm('You have unsaved changes. Discard them?')) {
                            setIsEditing(false);
                            setEditedContent(null);
                          }
                        } else {
                          setIsEditing(false);
                        }
                      } else {
                        setIsEditing(true);
                      }
                    }}
                    onSave={() => {
                      handleSave();
                      toast({
                        title: 'Page Saved',
                        description: 'Your changes have been saved.',
                      });
                    }}
                    onPrint={handlePrint}
                  />
                </div>
              ) : (
                // Empty state
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <BookOpen className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Knowledge Core</h2>
                  <p className="text-muted-foreground mb-4 max-w-md">
                    Select a page from the sidebar or create a new one to get started.
                  </p>
                  <Button onClick={() => handleCreatePage()}>
                    <Plus className="h-4 w-4 mr-1" />
                    Create Your First Page
                  </Button>
                </div>
              )}
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Create Page Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Page</DialogTitle>
              <DialogDescription>
                Add a new page to your knowledge base.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Page title"
                  value={newPage.title}
                  onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={newPage.category}
                  onValueChange={(value) => setNewPage({ ...newPage, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Template</label>
                <Select
                  value={newPage.template}
                  onValueChange={(value) => setNewPage({ ...newPage, template: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select template (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPLATES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateSubmit}
                disabled={!newPage.title || createPageMutation.isPending}
              >
                {createPageMutation.isPending ? 'Creating...' : 'Create Page'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Keyboard Shortcuts Dialog (US-WIKI-006) */}
        <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                ⌨️ Keyboard Shortcuts
              </DialogTitle>
              <DialogDescription>
                Quick reference for all available keyboard shortcuts
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Navigation</h4>
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Show shortcuts</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">⌘/</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Search pages</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">⌘K</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Close/Cancel</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Esc</kbd>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Editing</h4>
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Toggle edit mode</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">⌘E</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Save changes</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">⌘S</kbd>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Editor Formatting</h4>
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Bold</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">⌘B</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Italic</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">⌘I</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Underline</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">⌘U</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Code</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">⌘E</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Link</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">⌘K</kbd>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Mentions & Special</h4>
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Insert @mention</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">@</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Slash commands</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">/</kbd>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowShortcuts(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Page</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{pageToDelete?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => pageToDelete && deletePageMutation.mutate(pageToDelete.id)}
                disabled={deletePageMutation.isPending}
              >
                {deletePageMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Mention Preview Card (appears on hover) */}
        <MentionPreview
          entityType={previewState.entityType}
          entityId={previewState.entityId}
          isVisible={previewState.isVisible}
          position={previewState.position}
          onClose={hidePreview}
        />
      </div>
    </AppLayout>
  );
}

