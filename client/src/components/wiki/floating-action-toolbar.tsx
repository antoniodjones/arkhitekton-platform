import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sparkles,
  Pencil,
  Play,
  Pause,
  MessageSquarePlus,
  Share2,
  Copy,
  Link,
  Mail,
  FileDown,
  Volume2,
  VolumeX,
  Wand2,
  Save,
  Loader2,
  PenLine,
  Printer,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface FloatingActionToolbarProps {
  pageId?: string;
  pageTitle?: string;
  isEditing?: boolean;
  hasUnsavedChanges?: boolean;
  isSaving?: boolean;
  onAIAssist?: () => void;
  onAddComment?: () => void;
  onShare?: () => void;
  onToggleEdit?: () => void;
  onSave?: () => void;
  onPrint?: () => void;
  className?: string;
}

export function FloatingActionToolbar({
  pageId,
  pageTitle,
  isEditing = false,
  hasUnsavedChanges = false,
  isSaving = false,
  onAIAssist,
  onAddComment,
  onShare,
  onToggleEdit,
  onSave,
  onPrint,
  className,
}: FloatingActionToolbarProps) {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesisUtterance | null>(null);

  // Handle AI Assist
  const handleAIAssist = () => {
    if (onAIAssist) {
      onAIAssist();
    } else {
      toast({
        title: 'AI Assistant',
        description: 'Opening AI assistant for this page...',
      });
    }
  };

  // Handle Text-to-Speech
  const handleReadAloud = () => {
    if (isPlaying) {
      // Stop reading
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setSpeechSynthesis(null);
      toast({
        title: 'Reading Stopped',
        description: 'Text-to-speech has been stopped.',
      });
    } else {
      // Get page content text
      const editorContent = document.querySelector('.ProseMirror');
      const textContent = editorContent?.textContent || '';

      if (!textContent.trim()) {
        toast({
          title: 'No Content',
          description: 'There is no text content to read.',
          variant: 'destructive',
        });
        return;
      }

      // Start reading
      const utterance = new SpeechSynthesisUtterance(textContent);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => {
        setIsPlaying(false);
        setSpeechSynthesis(null);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setSpeechSynthesis(null);
        toast({
          title: 'Error',
          description: 'Failed to read content aloud.',
          variant: 'destructive',
        });
      };

      window.speechSynthesis.speak(utterance);
      setSpeechSynthesis(utterance);
      setIsPlaying(true);

      toast({
        title: 'Reading Aloud',
        description: 'Text-to-speech started. Click again to stop.',
      });
    }
  };

  // Handle Add Comment
  const handleAddComment = () => {
    if (onAddComment) {
      onAddComment();
    } else {
      toast({
        title: 'Add Comment',
        description: 'Select text to add a comment.',
      });
    }
  };

  // Handle Copy Link
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link Copied',
      description: 'Page link copied to clipboard.',
    });
  };

  // Handle Email Share
  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Check out: ${pageTitle || 'Wiki Page'}`);
    const body = encodeURIComponent(`I wanted to share this page with you:\n\n${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  // Handle Export
  const handleExport = () => {
    toast({
      title: 'Export',
      description: 'Exporting page as PDF...',
    });
    // Future: Implement actual PDF export
  };

  // Handle Toggle Edit
  const handleToggleEdit = () => {
    if (onToggleEdit) {
      onToggleEdit();
    } else {
      toast({
        title: isEditing ? 'View Mode' : 'Edit Mode',
        description: isEditing ? 'Switched to view mode.' : 'You can now edit this page.',
      });
    }
  };

  // Handle Save
  const handleSave = () => {
    if (isSaving) return; // Prevent double-click

    if (!hasUnsavedChanges && !onSave) {
      toast({
        title: 'No Changes',
        description: 'No changes to save.',
      });
      return;
    }

    if (onSave) {
      onSave();
    } else {
      toast({
        title: 'Page Saved',
        description: 'Your changes have been saved.',
      });
    }
  };

  // Handle Print
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      toast({
        title: 'Printing',
        description: 'Opening print dialog...',
      });
      // Use browser's native print
      window.print();
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn(
          'fixed right-6 top-1/2 -translate-y-1/2 z-50',
          'flex flex-col items-center gap-1',
          'bg-white dark:bg-slate-800',
          'rounded-full py-3 px-2',
          'shadow-lg border border-slate-200 dark:border-slate-700',
          'transition-all duration-200',
          'hover:shadow-xl',
          className
        )}
      >
        {/* AI Assist Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-600 dark:text-blue-400"
              onClick={handleAIAssist}
            >
              <div className="relative">
                <Sparkles className="h-5 w-5" />
                <Pencil className="h-3 w-3 absolute -bottom-0.5 -right-0.5" />
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>AI Assist</p>
          </TooltipContent>
        </Tooltip>

        {/* Edit/Save Button - Shows Edit when viewing, Save when editing */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-10 w-10 rounded-full relative',
                isEditing
                  ? 'hover:bg-green-50 dark:hover:bg-green-950 text-green-600 dark:text-green-400'
                  : 'hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-600 dark:text-blue-400',
                isSaving && 'opacity-50 cursor-not-allowed'
              )}
              onClick={isEditing ? handleSave : handleToggleEdit}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isEditing ? (
                <div className="relative">
                  <Save className="h-5 w-5" />
                  {hasUnsavedChanges && (
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse" />
                  )}
                </div>
              ) : (
                <PenLine className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>
              {isSaving 
                ? 'Saving...' 
                : isEditing 
                  ? hasUnsavedChanges 
                    ? 'Save Changes (unsaved)' 
                    : 'Save Changes'
                  : 'Edit Page'
              }
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Print Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-600 dark:text-blue-400"
              onClick={handlePrint}
            >
              <Printer className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Print Page</p>
          </TooltipContent>
        </Tooltip>

        {/* Read Aloud Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-10 w-10 rounded-full',
                isPlaying 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                  : 'hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-600 dark:text-blue-400'
              )}
              onClick={handleReadAloud}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{isPlaying ? 'Stop Reading' : 'Read Aloud'}</p>
          </TooltipContent>
        </Tooltip>

        {/* Add Comment Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-600 dark:text-blue-400"
              onClick={handleAddComment}
            >
              <MessageSquarePlus className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Add Comment</p>
          </TooltipContent>
        </Tooltip>

        {/* Share Dropdown */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-600 dark:text-blue-400"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Share</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent side="left" align="center" className="w-48">
            <DropdownMenuItem onClick={handleCopyLink}>
              <Link className="h-4 w-4 mr-2" />
              Copy Link
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEmailShare}>
              <Mail className="h-4 w-4 mr-2" />
              Share via Email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleExport}>
              <FileDown className="h-4 w-4 mr-2" />
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  );
}

export default FloatingActionToolbar;

