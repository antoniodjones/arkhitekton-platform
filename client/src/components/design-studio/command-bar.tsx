import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AISparkleIcon } from '@/components/ui/ai-sparkle-icon';
import { Search, Clock, FileText, Sparkles, ArrowRight, X } from 'lucide-react';

interface Model {
  id: string | number;
  title: string;
}

interface CommandBarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recentModels: Model[];
  onSelectModel?: (model: Model) => void;
  onAIQuery?: (query: string) => void;
}

/**
 * Command Bar Component
 * Implements EPIC-DSH-04: Command Bar & Search
 * - HLR-DSH-002: Unified search/command bar
 * - HLR-DSH-003: CMD+K / CTRL+K keyboard shortcut
 * - AI mode activation with "/" prefix
 */
export function CommandBar({ 
  open, 
  onOpenChange, 
  recentModels,
  onSelectModel,
  onAIQuery 
}: CommandBarProps) {
  const [query, setQuery] = useState('');
  const [isAIMode, setIsAIMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset state when closed
  useEffect(() => {
    if (!open) {
      setQuery('');
      setIsAIMode(false);
      setIsProcessing(false);
    }
  }, [open]);

  // Handle input changes - detect AI mode trigger
  const handleValueChange = useCallback((value: string) => {
    setQuery(value);
    // Switch to AI mode if starts with /
    if (value.startsWith('/') && !isAIMode) {
      setIsAIMode(true);
      setQuery(value.slice(1));
    }
  }, [isAIMode]);

  // Handle AI mode toggle
  const handleAIModeToggle = useCallback(() => {
    setIsAIMode(!isAIMode);
    setQuery('');
  }, [isAIMode]);

  // Handle selection
  const handleSelect = useCallback((model: Model) => {
    onSelectModel?.(model);
    onOpenChange(false);
  }, [onSelectModel, onOpenChange]);

  // Handle AI query submit
  const handleAISubmit = useCallback(() => {
    if (!query.trim()) return;
    setIsProcessing(true);
    onAIQuery?.(query);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      onOpenChange(false);
    }, 1500);
  }, [query, onAIQuery, onOpenChange]);

  // Handle Enter key
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isAIMode && query.trim()) {
      e.preventDefault();
      handleAISubmit();
    }
  }, [isAIMode, query, handleAISubmit]);

  // Filter models based on query
  const filteredModels = query
    ? recentModels.filter(m => 
        m.title.toLowerCase().includes(query.toLowerCase())
      )
    : recentModels;

  // AI prompt suggestions
  const aiSuggestions = [
    "Design an event-driven order processing system",
    "Review my architecture for security vulnerabilities",
    "Suggest improvements for scalability",
    "Create a microservices diagram for e-commerce",
  ];

  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl+';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 top-[20%] translate-y-0 gap-0">
        <div className={cn(
          'rounded-xl overflow-hidden border bg-white',
          isAIMode ? 'border-orange-500/50 ring-2 ring-orange-500/20' : 'border-slate-200'
        )}>
          {/* Input Area */}
          <div className="flex items-center px-4 gap-3 border-b border-slate-100">
            {isAIMode ? (
              <AISparkleIcon 
                size={20} 
                state={isProcessing ? 'processing' : 'active'}
              />
            ) : (
              <Search className="h-5 w-5 text-slate-400 shrink-0" />
            )}
            
            <input
              type="text"
              value={query}
              onChange={(e) => handleValueChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isAIMode 
                ? "Ask the AI assistant..." 
                : "Search models, objects, or type / for AI..."
              }
              className="flex-1 py-4 text-base bg-transparent border-0 outline-none placeholder:text-slate-400"
              autoFocus
            />

            {/* AI Mode toggle */}
            {!isAIMode && (
              <button
                type="button"
                onClick={handleAIModeToggle}
                className="flex items-center gap-1.5 px-2 py-1 text-sm text-slate-500 hover:text-orange-600 transition-colors"
              >
                <AISparkleIcon size={16} state="idle" />
                <span className="hidden sm:inline">Ask AI</span>
              </button>
            )}

            {/* Clear button */}
            {(query || isAIMode) && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setIsAIMode(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* AI Mode gradient bar */}
          {isAIMode && (
            <div className="h-0.5 bg-gradient-to-r from-orange-500 via-green-400 to-blue-400" />
          )}

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {isAIMode ? (
              // AI Mode Content
              isProcessing ? (
                <div className="py-8 text-center">
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-orange-50 rounded-lg text-orange-700">
                    <AISparkleIcon size={20} state="processing" />
                    <span>Thinking...</span>
                  </div>
                </div>
              ) : query ? (
                <div className="p-4">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-sm text-slate-600">
                      Press <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 font-mono text-xs">Enter</kbd> to ask AI about:
                    </p>
                    <p className="mt-1 font-medium text-slate-800">"{query}"</p>
                  </div>
                </div>
              ) : (
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Try asking
                  </div>
                  {aiSuggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setQuery(suggestion);
                        handleAISubmit();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left group"
                    >
                      <AISparkleIcon size={16} state="idle" className="opacity-50 group-hover:opacity-100" />
                      <span className="text-sm text-slate-700 group-hover:text-orange-700">
                        {suggestion}
                      </span>
                    </button>
                  ))}
                </div>
              )
            ) : (
              // Search Mode Content
              <div className="py-2">
                {filteredModels.length === 0 ? (
                  <div className="py-6 text-center text-slate-500">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>{query ? `No results for "${query}"` : 'No recent models'}</p>
                    {query && <p className="text-sm mt-1">Try different keywords or ask AI</p>}
                  </div>
                ) : (
                  <>
                    <div className="px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      {query ? 'Results' : 'Recent'}
                    </div>
                    {filteredModels.slice(0, 5).map((model) => (
                      <button
                        key={model.id}
                        onClick={() => handleSelect(model)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="flex-1 text-sm text-slate-700">{model.title}</span>
                        <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Footer with keyboard shortcuts */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 bg-slate-50 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 font-mono">↵</kbd>
                to {isAIMode ? 'send' : 'select'}
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 font-mono">↑↓</kbd>
                to navigate
              </span>
            </div>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 font-mono">esc</kbd>
              to close
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommandBar;


