import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { SuggestionProps } from '@tiptap/suggestion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Loader2
} from 'lucide-react';

interface MentionItem {
  id: string;
  entityType: string;
  title: string;
  status: string;
  url: string;
  metadata?: Record<string, any>;
}

export interface MentionListRef {
  onKeyDown: (event: KeyboardEvent) => boolean;
}

interface MentionListProps extends SuggestionProps<MentionItem> {}

// Entity type icons
const entityIcons: Record<string, React.ReactNode> = {
  user_story: <FileText className="h-4 w-4 text-blue-500" />,
  epic: <Target className="h-4 w-4 text-purple-500" />,
  defect: <Bug className="h-4 w-4 text-red-500" />,
  model: <Layers className="h-4 w-4 text-indigo-500" />,
  diagram: <Layers className="h-4 w-4 text-indigo-500" />,
  object: <Box className="h-4 w-4 text-cyan-500" />,
  component: <Box className="h-4 w-4 text-cyan-500" />,
  page: <FileText className="h-4 w-4 text-amber-500" />,
  application: <AppWindow className="h-4 w-4 text-green-500" />,
  capability: <Zap className="h-4 w-4 text-yellow-500" />,
  user: <User className="h-4 w-4 text-gray-500" />,
  adr: <FileCode className="h-4 w-4 text-purple-500" />,
  requirement: <Pin className="h-4 w-4 text-green-500" />,
};

// Entity type labels
const entityLabels: Record<string, string> = {
  user_story: 'Story',
  epic: 'Epic',
  defect: 'Defect',
  model: 'Model',
  diagram: 'Diagram',
  object: 'Object',
  component: 'Component',
  page: 'Page',
  application: 'App',
  capability: 'Capability',
  user: 'User',
  adr: 'ADR',
  requirement: 'Req',
};

// Status colors
const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  done: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  backlog: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  open: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  closed: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  deprecated: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  sunset: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  draft: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  published: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  low: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
};

export const MentionList = forwardRef<MentionListRef, MentionListProps>(
  (props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const items = props.items || [];

    const selectItem = (index: number) => {
      const item = items[index];
      if (item) {
        props.command({
          id: item.id,
          label: item.title,
          entityType: item.entityType,
          status: item.status,
          url: item.url,
        });
      }
    };

    const upHandler = () => {
      setSelectedIndex((selectedIndex + items.length - 1) % items.length);
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: (event: KeyboardEvent) => {
        if (event.key === 'ArrowUp') {
          upHandler();
          return true;
        }
        if (event.key === 'ArrowDown') {
          downHandler();
          return true;
        }
        if (event.key === 'Enter') {
          enterHandler();
          return true;
        }
        return false;
      },
    }));

    if (items.length === 0) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-4 text-center">
          {props.query ? (
            <div className="text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
              Searching...
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">
              Type to search entities...
            </div>
          )}
        </div>
      );
    }

    // Group items by entity type
    const grouped = items.reduce((acc, item) => {
      const type = item.entityType;
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    }, {} as Record<string, MentionItem[]>);

    return (
      <div className="bg-background border rounded-lg shadow-lg overflow-hidden min-w-[320px] max-w-[400px]">
        <div className="px-3 py-2 border-b bg-muted/30">
          <p className="text-xs text-muted-foreground">
            {items.length} result{items.length !== 1 ? 's' : ''} • Use ↑↓ to navigate, Enter to select
          </p>
        </div>
        <ScrollArea className="max-h-[300px]">
          <div className="p-1">
            {Object.entries(grouped).map(([type, typeItems]) => (
              <div key={type}>
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  {entityIcons[type]}
                  {entityLabels[type] || type}
                </div>
                {typeItems.map((item) => {
                  const globalIndex = items.findIndex((i) => i.id === item.id);
                  const isSelected = globalIndex === selectedIndex;
                  
                  return (
                    <button
                      key={item.id}
                      className={cn(
                        'w-full flex items-center gap-2 px-2 py-2 rounded text-left transition-colors',
                        isSelected
                          ? 'bg-amber-500/10 text-foreground'
                          : 'hover:bg-muted/50 text-foreground'
                      )}
                      onClick={() => selectItem(globalIndex)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                    >
                      <div className="flex-shrink-0">
                        {entityIcons[item.entityType]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate text-sm">
                            {item.title}
                          </span>
                          <Badge
                            variant="secondary"
                            className={cn(
                              'text-[10px] px-1.5 py-0',
                              statusColors[item.status] || statusColors.active
                            )}
                          >
                            {item.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {item.id}
                          {item.metadata?.description && (
                            <> • {item.metadata.description}</>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }
);

MentionList.displayName = 'MentionList';

export default MentionList;

