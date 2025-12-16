'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileText,
  Target,
  Bug,
  Layers,
  Box,
  AppWindow,
  Zap,
  User,
  FileCode,
  Pin,
  ExternalLink,
  Clock,
  User as UserIcon,
  Tag,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface MentionPreviewProps {
  entityType: string;
  entityId: string;
  isVisible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
}

// Entity type icons
const entityIcons: Record<string, React.ReactNode> = {
  user_story: <FileText className="h-5 w-5 text-blue-500" />,
  epic: <Target className="h-5 w-5 text-purple-500" />,
  defect: <Bug className="h-5 w-5 text-red-500" />,
  model: <Layers className="h-5 w-5 text-indigo-500" />,
  diagram: <Layers className="h-5 w-5 text-indigo-500" />,
  object: <Box className="h-5 w-5 text-cyan-500" />,
  component: <Box className="h-5 w-5 text-cyan-500" />,
  page: <FileText className="h-5 w-5 text-amber-500" />,
  application: <AppWindow className="h-5 w-5 text-green-500" />,
  capability: <Zap className="h-5 w-5 text-yellow-500" />,
  user: <User className="h-5 w-5 text-gray-500" />,
  adr: <FileCode className="h-5 w-5 text-purple-500" />,
  requirement: <Pin className="h-5 w-5 text-green-500" />,
};

// Entity type labels
const entityLabels: Record<string, string> = {
  user_story: 'User Story',
  epic: 'Epic',
  defect: 'Defect',
  model: 'Model',
  diagram: 'Diagram',
  object: 'Object',
  component: 'Component',
  page: 'Wiki Page',
  application: 'Application',
  capability: 'Capability',
  user: 'User',
  adr: 'ADR',
  requirement: 'Requirement',
};

// Status colors and labels
const statusConfig: Record<string, { color: string; label: string }> = {
  active: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Active' },
  'in-progress': { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'In Progress' },
  done: { color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300', label: 'Done' },
  backlog: { color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300', label: 'Backlog' },
  open: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'Open' },
  resolved: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Resolved' },
  closed: { color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300', label: 'Closed' },
  deprecated: { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', label: 'Deprecated' },
  sunset: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'Sunset' },
  draft: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Draft' },
  published: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Published' },
  critical: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'Critical' },
  high: { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', label: 'High' },
  medium: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Medium' },
  low: { color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300', label: 'Low' },
};

export function MentionPreview({ 
  entityType, 
  entityId, 
  isVisible, 
  position,
  onClose 
}: MentionPreviewProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  // Fetch entity details
  const { data: entity, isLoading, error } = useQuery({
    queryKey: ['/api/entities', entityType, entityId],
    queryFn: async () => {
      const response = await fetch(`/api/entities/${entityType}/${entityId}`);
      if (!response.ok) throw new Error('Failed to fetch entity');
      return response.json();
    },
    enabled: isVisible && !!entityType && !!entityId,
    staleTime: 30000, // Cache for 30 seconds
  });

  // Adjust position to stay within viewport
  useEffect(() => {
    if (cardRef.current && isVisible) {
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newX = position.x;
      let newY = position.y;

      // Check right edge
      if (position.x + rect.width > viewportWidth - 20) {
        newX = viewportWidth - rect.width - 20;
      }

      // Check bottom edge
      if (position.y + rect.height > viewportHeight - 20) {
        newY = position.y - rect.height - 10;
      }

      // Check left edge
      if (newX < 20) {
        newX = 20;
      }

      // Check top edge
      if (newY < 20) {
        newY = 20;
      }

      setAdjustedPosition({ x: newX, y: newY });
    }
  }, [position, isVisible]);

  if (!isVisible) return null;

  const status = entity?.status || 'active';
  const statusInfo = statusConfig[status] || statusConfig.active;

  return (
    <div
      ref={cardRef}
      className={cn(
        'fixed z-50 w-80 bg-background border rounded-lg shadow-xl overflow-hidden',
        'animate-in fade-in-0 zoom-in-95 duration-200'
      )}
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
      }}
      onMouseLeave={onClose}
    >
      {isLoading ? (
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-16 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      ) : error ? (
        <div className="p-4 text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Failed to load entity</p>
        </div>
      ) : entity ? (
        <>
          {/* Header */}
          <div className="p-4 border-b bg-muted/30">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded bg-background border">
                {entityIcons[entityType] || <FileText className="h-5 w-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {entityLabels[entityType] || entityType}
                  </Badge>
                  <Badge className={cn('text-xs', statusInfo.color)}>
                    {statusInfo.label}
                  </Badge>
                </div>
                <h3 className="font-semibold text-sm truncate">
                  {entity.title}
                </h3>
                <p className="text-xs text-muted-foreground">{entity.id}</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3">
            {entity.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {entity.description}
              </p>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {entity.metadata?.assignee && (
                <span className="flex items-center gap-1">
                  <UserIcon className="h-3 w-3" />
                  {entity.metadata.assignee}
                </span>
              )}
              {entity.metadata?.owner && (
                <span className="flex items-center gap-1">
                  <UserIcon className="h-3 w-3" />
                  {entity.metadata.owner}
                </span>
              )}
              {entity.metadata?.updatedAt && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(new Date(entity.metadata.updatedAt), 'MMM d, yyyy')}
                </span>
              )}
              {entity.metadata?.storyPoints && (
                <span className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {entity.metadata.storyPoints} pts
                </span>
              )}
              {entity.metadata?.severity && (
                <Badge 
                  variant="outline" 
                  className={cn(
                    'text-[10px]',
                    statusConfig[entity.metadata.severity]?.color
                  )}
                >
                  {entity.metadata.severity}
                </Badge>
              )}
              {entity.metadata?.priority && (
                <Badge variant="outline" className="text-[10px]">
                  {entity.metadata.priority}
                </Badge>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-t bg-muted/20">
            <Link href={entity.url}>
              <Button size="sm" className="w-full" variant="secondary">
                <ExternalLink className="h-3.5 w-3.5 mr-2" />
                View {entityLabels[entityType] || 'Entity'}
              </Button>
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}

// Hook to manage mention preview state
export function useMentionPreview() {
  const [previewState, setPreviewState] = useState<{
    isVisible: boolean;
    entityType: string;
    entityId: string;
    position: { x: number; y: number };
  }>({
    isVisible: false,
    entityType: '',
    entityId: '',
    position: { x: 0, y: 0 },
  });

  const showTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  const showPreview = (entityType: string, entityId: string, x: number, y: number) => {
    // Clear any pending hide
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    // Show after delay
    showTimeoutRef.current = setTimeout(() => {
      setPreviewState({
        isVisible: true,
        entityType,
        entityId,
        position: { x, y },
      });
    }, 500); // 500ms delay before showing
  };

  const hidePreview = () => {
    // Clear any pending show
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
    }

    // Hide after delay
    hideTimeoutRef.current = setTimeout(() => {
      setPreviewState(prev => ({ ...prev, isVisible: false }));
    }, 300); // 300ms delay before hiding
  };

  const cancelHide = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  return {
    previewState,
    showPreview,
    hidePreview,
    cancelHide,
  };
}

export default MentionPreview;

