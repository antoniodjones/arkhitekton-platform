import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronDown, Folder, FolderOpen, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TestSuite } from '@shared/schema';

interface TestSuiteTreeProps {
  suites: TestSuite[];
  selectedSuiteId: string | null;
  onSelectSuite: (id: string) => void;
  onEditSuite: (suite: TestSuite) => void;
}

export function TestSuiteTree({ 
  suites, 
  selectedSuiteId, 
  onSelectSuite,
  onEditSuite 
}: TestSuiteTreeProps) {
  const [expandedSuites, setExpandedSuites] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/test-suites/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete test suite');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/test-suites'] });
    },
  });

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedSuites);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSuites(newExpanded);
  };

  const handleDelete = async (suite: TestSuite, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete suite "${suite.name}" and all its children?`)) {
      await deleteMutation.mutateAsync(suite.id);
    }
  };

  const renderSuite = (suite: TestSuite, level: number = 0) => {
    const children = suites.filter(s => s.parentSuiteId === suite.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedSuites.has(suite.id);
    const isSelected = selectedSuiteId === suite.id;

    return (
      <div key={suite.id}>
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer group",
            isSelected && "bg-indigo-50 dark:bg-indigo-900/30 border-l-2 border-indigo-500"
          )}
          style={{ paddingLeft: `${level * 20 + 12}px` }}
          onClick={() => onSelectSuite(suite.id)}
        >
          {/* Expand/Collapse Icon */}
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(suite.id);
              }}
              className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          ) : (
            <div className="w-5" />
          )}

          {/* Folder Icon */}
          {isExpanded || hasChildren ? (
            <FolderOpen className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
          ) : (
            <Folder className="w-4 h-4 text-gray-400" />
          )}

          {/* Suite Name */}
          <span className="flex-1 text-sm font-medium truncate">
            {suite.name}
          </span>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEditSuite(suite)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => handleDelete(suite, e)}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Render children if expanded */}
        {hasChildren && isExpanded && (
          <div>
            {children.map(child => renderSuite(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootSuites = suites.filter(s => !s.parentSuiteId);

  return (
    <div className="py-2">
      {rootSuites.length === 0 ? (
        <div className="p-4 text-center text-sm text-muted-foreground">
          No test suites yet. Create one to get started.
        </div>
      ) : (
        rootSuites.map(suite => renderSuite(suite))
      )}
    </div>
  );
}

