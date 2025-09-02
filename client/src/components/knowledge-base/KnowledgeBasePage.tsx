import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Calendar, 
  User, 
  Tag, 
  FileText, 
  Edit, 
  Share, 
  Star,
  Clock,
  Eye,
  MoreHorizontal,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage,
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import type { KnowledgeBasePage as KBPage } from '@shared/schema';
import { cn } from '@/lib/utils';
import { RichContentEditor } from './RichContentEditor';

interface KnowledgeBasePageProps {
  pageId?: string;
  onBack?: () => void;
  className?: string;
}

export function KnowledgeBasePage({ pageId, onBack, className }: KnowledgeBasePageProps) {
  // Auto-start edit mode for new pages
  const [isEditing, setIsEditing] = useState(pageId === 'new-page');

  // Fetch page data
  const { data: page, isLoading } = useQuery<KBPage>({
    queryKey: ['/api/knowledge-base/pages', pageId],
    enabled: !!pageId,
  });

  // Fetch breadcrumbs
  const { data: breadcrumbs = [] } = useQuery<{ id: string; title: string; path: string }[]>({
    queryKey: ['/api/knowledge-base/pages', pageId, 'breadcrumbs'],
    enabled: !!pageId,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'draft': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'under_review': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400';
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderContent = (content: any) => {
    if (!content?.blocks) return null;

    return content.blocks.map((block: any, index: number) => {
      switch (block.type) {
        case 'paragraph':
          return (
            <p key={index} className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              {block.content}
            </p>
          );
        case 'heading':
          const HeadingTag = `h${block.level || 2}` as keyof JSX.IntrinsicElements;
          return (
            <HeadingTag 
              key={index} 
              className="font-bold text-slate-900 dark:text-white mb-3 mt-6"
            >
              {block.content}
            </HeadingTag>
          );
        case 'list':
          const ListTag = block.style === 'ordered' ? 'ol' : 'ul';
          return (
            <ListTag key={index} className="text-slate-700 dark:text-slate-300 mb-4 ml-6">
              {block.items?.map((item: string, i: number) => (
                <li key={i} className="mb-1">{item}</li>
              ))}
            </ListTag>
          );
        case 'code':
          return (
            <pre key={index} className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto">
              <code className="text-sm text-slate-800 dark:text-slate-200">
                {block.content}
              </code>
            </pre>
          );
        default:
          return null;
      }
    });
  };

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!pageId) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
        <FileText className="h-24 w-24 text-slate-300 dark:text-slate-600 mb-6" />
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-4">
          Welcome to Knowledge Base
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">
          Select a page from the navigation tree to start exploring your documentation, 
          or create a new page to begin building your knowledge base.
        </p>
      </div>
    );
  }

  // Handle new page creation
  if (pageId === 'new-page') {
    const newPage: KBPage = {
      id: 'new-page',
      title: 'Untitled',
      slug: null,
      content: '',
      category: null,
      status: 'Draft',
      tags: null,
      parentPageId: null,
      order: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return (
      <div className={cn("max-w-6xl mx-auto p-6", className)}>
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
          <CardContent className="p-8">
            <RichContentEditor
              content={newPage.content || ''}
              onChange={(content) => {
                // Auto-save logic will be handled by the editor
              }}
              placeholder="Start writing your new page..."
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!page) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
        <FileText className="h-24 w-24 text-slate-300 dark:text-slate-600 mb-6" />
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-4">
          Page Not Found
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("h-full overflow-y-auto", className)}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          {breadcrumbs.length > 0 && (
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.id} className="flex items-center">
                    <BreadcrumbItem>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage className="text-orange-600 dark:text-orange-400">
                          {crumb.title}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink 
                          href="#" 
                          className="text-slate-600 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400"
                        >
                          {crumb.title}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && (
                      <BreadcrumbSeparator>
                        <ChevronRight className="h-4 w-4" />
                      </BreadcrumbSeparator>
                    )}
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Star className="h-4 w-4 mr-2" />
              Bookmark
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              size="sm"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              onClick={() => setIsEditing(!isEditing)}
              data-testid="button-edit-page"
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? 'Preview' : 'Edit'}
            </Button>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                {page.title}
              </h1>
              
              <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>By System</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Updated {formatDate(page.updatedAt || new Date())}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Created {formatDate(page.createdAt || new Date())}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              <Badge className={getStatusColor(page.status || 'Draft')}>
                {page.status === 'under_review' ? 'Under Review' : (page.status || 'Draft')}
              </Badge>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Version 1.0
              </div>
            </div>
          </div>

          {/* Tags */}
          {page.tags && page.tags.length > 0 && (
            <div className="flex items-center space-x-2 mb-4">
              <Tag className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <div className="flex flex-wrap gap-1">
                {page.tags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="text-xs px-2 py-0.5 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator className="my-6" />
        </div>

        {/* Page Content */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
          <CardContent className="p-8">
            {isEditing ? (
              <RichContentEditor
                content={page.content || ''}
                onChange={(newContent) => {
                  // Auto-save functionality can be added here
                  console.log('Content changed:', newContent);
                }}
                placeholder="Start writing your knowledge base content..."
                className="min-h-[400px]"
              />
            ) : (
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {renderContent(page.content)}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Page Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Page Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Category:</span>
                <Badge variant="outline" className="text-xs">
                  {page.category}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Status:</span>
                <Badge variant="outline" className="text-xs">
                  {page.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Created:</span>
                <span className="font-medium text-xs">
                  {page.createdAt ? new Date(page.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Collaboration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Tags:</span>
                <span className="font-medium">{page.tags?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Updated:</span>
                <span className="font-medium text-xs">
                  {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Slug:</span>
                <code className="text-xs bg-slate-100 dark:bg-slate-700 px-1 rounded">
                  {page.slug || 'auto-generated'}
                </code>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Links & Models
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Parent Page:</span>
                <span className="font-medium">{page.parentPageId ? 'Yes' : 'Root'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Content Length:</span>
                <span className="font-medium">{page.content.length} chars</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Order:</span>
                <span className="font-medium">{page.order || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}