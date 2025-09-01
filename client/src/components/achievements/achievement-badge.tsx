import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Trophy, 
  Crown, 
  Star, 
  Award, 
  Target,
  Zap,
  Brain,
  Network,
  Building,
  Layers,
  Link,
  Puzzle,
  Flame,
  Baby
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AchievementBadgeProps {
  name: string;
  description: string;
  category: 'complexity' | 'collaboration' | 'quality' | 'consistency' | 'innovation';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  iconName: string;
  color: string;
  isUnlocked: boolean;
  currentProgress?: number;
  maxProgress?: number;
  pointsEarned?: number;
  size?: 'small' | 'medium' | 'large';
  showProgress?: boolean;
  className?: string;
}

const iconMap = {
  trophy: Trophy,
  crown: Crown,
  star: Star,
  award: Award,
  target: Target,
  zap: Zap,
  brain: Brain,
  network: Network,
  building: Building,
  layers: Layers,
  link: Link,
  puzzle: Puzzle,
  flame: Flame,
  baby: Baby
};

const tierColors = {
  bronze: { bg: 'from-amber-600 to-yellow-700', border: 'border-amber-500', glow: 'shadow-amber-500/20' },
  silver: { bg: 'from-slate-400 to-slate-600', border: 'border-slate-400', glow: 'shadow-slate-500/20' },
  gold: { bg: 'from-yellow-400 to-yellow-600', border: 'border-yellow-400', glow: 'shadow-yellow-500/30' },
  platinum: { bg: 'from-slate-200 to-slate-400', border: 'border-slate-300', glow: 'shadow-slate-400/30' },
  diamond: { bg: 'from-cyan-200 to-blue-400', border: 'border-cyan-300', glow: 'shadow-cyan-400/40' }
};

const categoryColors = {
  complexity: 'text-purple-600',
  collaboration: 'text-green-600', 
  quality: 'text-blue-600',
  consistency: 'text-orange-600',
  innovation: 'text-pink-600'
};

const sizeClasses = {
  small: { card: 'w-16 h-16', icon: 'w-6 h-6', text: 'text-xs' },
  medium: { card: 'w-20 h-20', icon: 'w-8 h-8', text: 'text-sm' },
  large: { card: 'w-24 h-24', icon: 'w-10 h-10', text: 'text-base' }
};

export function AchievementBadge({
  name,
  description,
  category,
  tier,
  iconName,
  color,
  isUnlocked,
  currentProgress = 0,
  maxProgress = 100,
  pointsEarned = 0,
  size = 'medium',
  showProgress = true,
  className
}: AchievementBadgeProps) {
  const IconComponent = iconMap[iconName as keyof typeof iconMap] || Trophy;
  const tierStyle = tierColors[tier];
  const categoryColor = categoryColors[category];
  const sizeClass = sizeClasses[size];
  const progressPercentage = maxProgress > 0 ? (currentProgress / maxProgress) * 100 : 0;

  const badgeContent = (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:scale-105",
        sizeClass.card,
        isUnlocked 
          ? `bg-gradient-to-br ${tierStyle.bg} ${tierStyle.border} ${tierStyle.glow} shadow-lg border-2`
          : "bg-muted border-2 border-muted-foreground/20 grayscale",
        className
      )}
      data-testid={`achievement-badge-${name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <CardContent className="p-2 h-full flex flex-col items-center justify-center">
        <div className={cn(
          "flex items-center justify-center rounded-full mb-1",
          isUnlocked ? "text-white" : "text-muted-foreground"
        )}>
          <IconComponent className={sizeClass.icon} />
        </div>
        
        {size === 'large' && (
          <div className={cn("text-center", sizeClass.text)}>
            <div className={cn("font-bold", isUnlocked ? "text-white" : "text-muted-foreground")}>
              {name}
            </div>
          </div>
        )}
      </CardContent>

      {/* Progress indicator for small badges */}
      {showProgress && !isUnlocked && currentProgress > 0 && size === 'small' && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}

      {/* Tier indicator */}
      {isUnlocked && (
        <div className="absolute top-1 right-1">
          <Badge variant="secondary" className={cn("text-xs px-1", sizeClass.text)}>
            {tier}
          </Badge>
        </div>
      )}

      {/* Points earned */}
      {isUnlocked && pointsEarned > 0 && size !== 'small' && (
        <div className="absolute bottom-1 left-1">
          <Badge variant="outline" className={cn("text-xs", sizeClass.text)}>
            +{pointsEarned}
          </Badge>
        </div>
      )}

      {/* Glow effect for unlocked achievements */}
      {isUnlocked && (
        <div className={cn(
          "absolute inset-0 rounded-lg opacity-30 animate-pulse",
          tierStyle.bg
        )} />
      )}
    </Card>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badgeContent}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-2">
            <div className="font-bold text-sm">{name}</div>
            <div className="text-xs text-muted-foreground">{description}</div>
            
            <div className="flex items-center justify-between text-xs">
              <Badge variant="outline" className={categoryColor}>
                {category}
              </Badge>
              <Badge variant="secondary">
                {tier.toUpperCase()}
              </Badge>
            </div>

            {showProgress && !isUnlocked && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>{currentProgress}/{maxProgress}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            )}

            {isUnlocked && pointsEarned > 0 && (
              <div className="text-center">
                <Badge className="bg-green-600">
                  +{pointsEarned} Points Earned!
                </Badge>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}