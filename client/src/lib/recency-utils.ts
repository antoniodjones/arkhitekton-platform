/**
 * Recency Utilities for Design Studio
 * Implements HLR-DSH-014: Recency indicator colors
 * - Orange (#F97316): Updated within 24 hours
 * - Green (#4ADE80): Updated 1-7 days ago
 * - Blue (#60A5FA): Updated 7-30 days ago
 * - Gray (#64748B): Updated over 30 days ago
 */

export type RecencyCategory = '24h' | '7d' | '30d' | 'older';

/**
 * Get recency category based on last updated timestamp
 */
export function getRecencyCategory(updatedAt: string | Date): RecencyCategory {
  const now = Date.now();
  const updated = new Date(updatedAt).getTime();
  const hoursAgo = (now - updated) / (1000 * 60 * 60);

  if (hoursAgo < 24) return '24h';
  if (hoursAgo < 168) return '7d'; // 7 * 24 = 168 hours
  if (hoursAgo < 720) return '30d'; // 30 * 24 = 720 hours
  return 'older';
}

/**
 * Get Tailwind color class for recency dot
 */
export function getRecencyColorClass(recency: RecencyCategory): string {
  switch (recency) {
    case '24h':
      return 'bg-orange-500'; // #F97316
    case '7d':
      return 'bg-green-400'; // #4ADE80
    case '30d':
      return 'bg-blue-400'; // #60A5FA
    case 'older':
      return 'bg-slate-400'; // #64748B
  }
}

/**
 * Get human-readable recency label
 */
export function getRecencyLabel(recency: RecencyCategory): string {
  switch (recency) {
    case '24h':
      return 'Updated today';
    case '7d':
      return 'Updated this week';
    case '30d':
      return 'Updated this month';
    case 'older':
      return 'Updated over 30 days ago';
  }
}

/**
 * Format relative time string (e.g., "2 hours ago", "3 days ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diffMs = now - then;
  
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  
  // For older dates, show the date
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}


