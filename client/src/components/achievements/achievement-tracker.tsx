import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  TrendingUp, 
  ChevronUp, 
  ChevronDown,
  Zap,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AchievementProgress {
  id: string;
  name: string;
  currentProgress: number;
  maxProgress: number;
  category: 'complexity' | 'collaboration' | 'quality' | 'consistency' | 'innovation';
  pointsToEarn: number;
  isClose: boolean; // Within 80% of completion
}

interface AchievementTrackerProps {
  achievements: AchievementProgress[];
  userLevel: number;
  userExp: number;
  nextLevelExp: number;
  currentStreak: number;
  onViewDashboard?: () => void;
  className?: string;
}

export function AchievementTracker({
  achievements,
  userLevel,
  userExp,
  nextLevelExp,
  currentStreak,
  onViewDashboard,
  className
}: AchievementTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  
  const levelProgress = nextLevelExp > 0 ? (userExp / nextLevelExp) * 100 : 100;
  const closeAchievements = achievements.filter(a => a.isClose);
  const inProgressAchievements = achievements.filter(a => a.currentProgress > 0 && !a.isClose);

  // Show notification when close to achievements
  useEffect(() => {
    if (closeAchievements.length > 0) {
      setShowNotification(true);
      const timer = setTimeout(() => setShowNotification(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [closeAchievements.length]);

  const getLevelColor = (level: number) => {
    if (level >= 50) return "from-red-500 to-orange-500";
    if (level >= 40) return "from-cyan-400 to-blue-500";
    if (level >= 30) return "from-slate-300 to-slate-500";
    if (level >= 20) return "from-yellow-400 to-yellow-600";
    if (level >= 10) return "from-slate-400 to-slate-600";
    return "from-amber-500 to-yellow-600";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'complexity': return <Target className="w-3 h-3" />;
      case 'quality': return <Star className="w-3 h-3" />;
      case 'collaboration': return <Trophy className="w-3 h-3" />;
      default: return <Zap className="w-3 h-3" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'complexity': return 'text-purple-600 bg-purple-50';
      case 'quality': return 'text-blue-600 bg-blue-50';
      case 'collaboration': return 'text-green-600 bg-green-50';
      case 'consistency': return 'text-orange-600 bg-orange-50';
      case 'innovation': return 'text-pink-600 bg-pink-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className={cn("bg-card border border-border rounded-lg shadow-sm", className)}>
      {/* Header */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm",
              getLevelColor(userLevel)
            )}>
              {userLevel}
            </div>
            <div>
              <div className="font-medium text-sm">Level {userLevel}</div>
              <div className="text-xs text-muted-foreground">
                {userExp.toLocaleString()} / {nextLevelExp.toLocaleString()} XP
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Streak indicator */}
            {currentStreak > 0 && (
              <Badge variant="outline" className="text-xs">
                🔥 {currentStreak}d
              </Badge>
            )}
            
            {/* Close achievements notification */}
            <AnimatePresence>
              {showNotification && closeAchievements.length > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="relative"
                >
                  <Badge className="bg-yellow-500 animate-pulse">
                    <Trophy className="w-3 h-3 mr-1" />
                    {closeAchievements.length}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Level progress */}
        <div className="mt-2">
          <Progress value={levelProgress} className="h-1" />
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 space-y-3">
              {/* Close to completion achievements */}
              {closeAchievements.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-yellow-500" />
                    Almost There!
                  </div>
                  <div className="space-y-2">
                    {closeAchievements.map((achievement) => (
                      <div key={achievement.id} className="bg-muted/50 rounded p-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "w-2 h-2 rounded-full",
                              getCategoryColor(achievement.category)
                            )} />
                            <span className="text-xs font-medium">{achievement.name}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            +{achievement.pointsToEarn}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">
                              {achievement.currentProgress}/{achievement.maxProgress}
                            </span>
                            <span className="text-green-600 font-medium">
                              {Math.round((achievement.currentProgress / achievement.maxProgress) * 100)}%
                            </span>
                          </div>
                          <Progress 
                            value={(achievement.currentProgress / achievement.maxProgress) * 100} 
                            className="h-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Other in-progress achievements */}
              {inProgressAchievements.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    In Progress ({inProgressAchievements.length})
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {inProgressAchievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {getCategoryIcon(achievement.category)}
                          <span className="text-xs truncate">{achievement.name}</span>
                        </div>
                        <div className="text-xs text-muted-foreground ml-2">
                          {Math.round((achievement.currentProgress / achievement.maxProgress) * 100)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick stats */}
              <div className="text-xs text-center pt-2 border-t border-border">
                <div className="flex justify-center gap-4">
                  <span className="text-muted-foreground">
                    Progress: {achievements.filter(a => a.currentProgress > 0).length}/{achievements.length}
                  </span>
                  {currentStreak > 0 && (
                    <span className="text-orange-600">
                      🔥 {currentStreak} day streak
                    </span>
                  )}
                </div>
              </div>

              {/* View dashboard button */}
              {onViewDashboard && (
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onViewDashboard}
                    className="w-full text-xs"
                  >
                    <Trophy className="w-3 h-3 mr-1" />
                    View Full Dashboard
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}