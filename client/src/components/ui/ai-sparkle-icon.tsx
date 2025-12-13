import { cn } from '@/lib/utils';

interface AISparkleIconProps {
  size?: number;
  state?: 'idle' | 'active' | 'processing';
  className?: string;
}

/**
 * AI Sparkle Icon Component
 * Implements EPIC-AI-01: AI Assistant Core visual identity
 * - Idle: Static four-pointed star
 * - Active: Subtle pulse animation
 * - Processing: Spinning animation
 */
export function AISparkleIcon({ size = 24, state = 'idle', className }: AISparkleIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn(
        'transition-all duration-200',
        state === 'processing' && 'animate-spin',
        state === 'active' && 'animate-pulse',
        className
      )}
      style={{ width: size, height: size }}
    >
      <path
        d="M12 2L14 9L21 12L14 15L12 22L10 15L3 12L10 9L12 2Z"
        fill="url(#ai-gradient)"
        stroke="#EA580C"
        strokeWidth="0.5"
      />
      <circle cx="12" cy="12" r="2" fill="#FFEDD5" />
      <defs>
        <linearGradient id="ai-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="50%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default AISparkleIcon;


