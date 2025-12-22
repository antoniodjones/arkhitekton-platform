import { useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';

export interface SearchResult {
  id: string;
  entityType: 'user_story' | 'epic' | 'defect' | 'application' | 'initiative' | 'page' | 'model' | 'object' | 'capability' | 'element';
  title: string;
  description?: string;
  status: string;
  score: number;
  url: string;
  metadata?: Record<string, any>;
}

export interface SearchResponse {
  query: string;
  totalResults: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  results: SearchResult[];
  grouped: Record<string, SearchResult[]>;
}

export interface UseGlobalSearchOptions {
  query: string;
  type?: string;
  limit?: number;
  offset?: number;
  enabled?: boolean;
  debounceMs?: number;
}

/**
 * Custom hook for global search functionality
 * Implements debouncing and React Query for caching
 */
export function useGlobalSearch(options: UseGlobalSearchOptions) {
  const { query, type, limit = 10, offset = 0, enabled = true } = options;
  
  // Minimum 2 characters to trigger search
  const shouldSearch = enabled && query.trim().length >= 2;

  const searchQuery = useQuery<SearchResponse>({
    queryKey: ['globalSearch', query, type, limit, offset],
    queryFn: async () => {
      const params = new URLSearchParams({
        q: query,
        limit: String(limit),
        offset: String(offset),
      });
      
      if (type) {
        params.append('type', type);
      }

      const response = await fetch(`/api/entities/search?${params}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      return response.json();
    },
    enabled: shouldSearch,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  return {
    results: searchQuery.data?.results || [],
    grouped: searchQuery.data?.grouped || {},
    totalResults: searchQuery.data?.totalResults || 0,
    hasMore: searchQuery.data?.hasMore || false,
    isLoading: searchQuery.isLoading,
    isError: searchQuery.isError,
    error: searchQuery.error,
    refetch: searchQuery.refetch,
  };
}

/**
 * Hook for debounced search input
 * Returns debounced value after specified delay
 */
export function useDebouncedSearch(initialValue: string = '', delayMs: number = 300) {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
    
    const timeoutId = setTimeout(() => {
      setDebouncedValue(newValue);
    }, delayMs);

    return () => clearTimeout(timeoutId);
  }, [delayMs]);

  return {
    value,
    debouncedValue,
    setValue: handleChange,
    setImmediate: (newValue: string) => {
      setValue(newValue);
      setDebouncedValue(newValue);
    },
  };
}

/**
 * Get entity type display name and icon
 */
export function getEntityTypeInfo(entityType: string): { label: string; icon: string; color: string } {
  const typeMap: Record<string, { label: string; icon: string; color: string }> = {
    user_story: { label: 'User Story', icon: '📝', color: 'blue' },
    epic: { label: 'Epic', icon: '🎯', color: 'purple' },
    defect: { label: 'Defect', icon: '🐛', color: 'red' },
    application: { label: 'Application', icon: '💻', color: 'green' },
    initiative: { label: 'Initiative', icon: '🚀', color: 'orange' },
    page: { label: 'Wiki Page', icon: '📄', color: 'slate' },
    model: { label: 'Model', icon: '🏗️', color: 'indigo' },
    object: { label: 'Component', icon: '🧩', color: 'teal' },
    capability: { label: 'Capability', icon: '⚡', color: 'amber' },
    element: { label: 'Element', icon: '🔷', color: 'cyan' },
  };

  return typeMap[entityType] || { label: entityType, icon: '📦', color: 'gray' };
}

/**
 * Get entity status badge color
 */
export function getStatusColor(status: string): string {
  const normalizedStatus = status.toLowerCase();
  
  if (['active', 'in-progress', 'in_progress', 'sprint'].includes(normalizedStatus)) {
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  }
  
  if (['done', 'completed', 'published'].includes(normalizedStatus)) {
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  }
  
  if (['archived', 'deprecated'].includes(normalizedStatus)) {
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
  
  if (['backlog', 'planned'].includes(normalizedStatus)) {
    return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
  }
  
  return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
}

