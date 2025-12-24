/**
 * Global Search Modal Component
 * Implements US-SEARCH-006: Keyboard Shortcuts
 * Fixes DEF-SEARCH-001: CMD+K not opening search
 * 
 * Features:
 * - Opens with CMD+K (Mac) or CTRL+K (Windows/Linux) from anywhere
 * - Auto-focuses search input
 * - Shows results across all entity types
 * - Keyboard navigation support
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useGlobalSearch, useDebouncedSearch } from '@/hooks/use-global-search';
import { SearchResultCard } from '@/components/search/search-result-card';
import { Search, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GlobalSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearchModal({ open, onOpenChange }: GlobalSearchModalProps) {
  const [, setLocation] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Debounced search with 300ms delay
  const { value: searchQuery, debouncedValue: debouncedQuery, setValue: setSearchQuery } = useDebouncedSearch('', 300);

  // Global search hook
  const { results, totalResults, isLoading, isError } = useGlobalSearch({
    query: debouncedQuery,
    limit: 20,
    enabled: debouncedQuery.length >= 2,
  });

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [open, setSearchQuery]);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      // Small delay to ensure dialog is fully rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Keyboard navigation (Arrow keys, Enter, Escape)
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          handleResultClick(results[selectedIndex].url);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onOpenChange(false);
        break;
    }
  }, [results, selectedIndex, onOpenChange]);

  // Handle result click navigation
  const handleResultClick = useCallback((url: string) => {
    setLocation(url);
    onOpenChange(false);
  }, [setLocation, onOpenChange]);

  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const shortcutKey = isMac ? '⌘K' : 'Ctrl+K';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-2xl p-0 top-[15%] translate-y-0 gap-0 overflow-hidden"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Search Input Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search user stories, defects, applications, models, pages..."
            className="flex-1 text-base bg-transparent border-0 outline-none placeholder:text-muted-foreground text-foreground"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono text-muted-foreground bg-muted border border-border rounded">
            {shortcutKey}
          </kbd>
        </div>

        {/* Search Results */}
        <div className="max-h-[500px] overflow-y-auto">
          {!searchQuery.trim() && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Search className="w-7 h-7 text-orange-500" />
              </div>
              <p className="text-foreground font-medium mb-2">Search ARKHITEKTON</p>
              <p className="text-sm text-muted-foreground mb-4">
                Find user stories, defects, applications, models, and more
              </p>
              <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-muted border border-border rounded font-mono">↓</kbd>
                  <kbd className="px-2 py-1 bg-muted border border-border rounded font-mono">↑</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-muted border border-border rounded font-mono">Enter</kbd>
                  <span>Select</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-muted border border-border rounded font-mono">Esc</kbd>
                  <span>Close</span>
                </div>
              </div>
            </div>
          )}

          {searchQuery.trim() && debouncedQuery.length < 2 && (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Type at least 2 characters to search...
              </p>
            </div>
          )}

          {debouncedQuery.length >= 2 && isLoading && (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 mx-auto mb-3 text-orange-500 animate-spin" />
              <p className="text-foreground font-medium mb-1">Searching...</p>
              <p className="text-sm text-muted-foreground">Scanning all modules</p>
            </div>
          )}

          {debouncedQuery.length >= 2 && isError && (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full mx-auto mb-3 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-foreground font-medium mb-1">Search failed</p>
              <p className="text-sm text-muted-foreground">Please try again</p>
            </div>
          )}

          {debouncedQuery.length >= 2 && !isLoading && !isError && results.length > 0 && (
            <div className="p-3">
              <div className="text-xs text-muted-foreground mb-3 px-3 pt-2 font-medium tracking-wide uppercase">
                {totalResults} Result{totalResults !== 1 ? 's' : ''} Found
              </div>
              <div className="space-y-1">
                {results.map((result, index) => (
                  <div
                    key={result.id}
                    className={cn(
                      "rounded-lg transition-all cursor-pointer",
                      index === selectedIndex && "ring-2 ring-orange-500"
                    )}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => handleResultClick(result.url)}
                  >
                    <SearchResultCard 
                      result={result}
                      onClick={() => handleResultClick(result.url)}
                      highlighted={index === selectedIndex}
                    />
                  </div>
                ))}
              </div>
              
              {totalResults > results.length && (
                <div className="mt-4 pt-3 border-t border-border text-center">
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    Showing {results.length} of {totalResults} results
                    <ArrowRight className="w-3 h-3" />
                  </p>
                </div>
              )}
            </div>
          )}

          {debouncedQuery.length >= 2 && !isLoading && !isError && results.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-3 flex items-center justify-center">
                <Search className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium mb-1">
                No results for "{debouncedQuery}"
              </p>
              <p className="text-sm text-muted-foreground">
                Try different keywords or browse modules
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

