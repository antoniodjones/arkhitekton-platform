import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Trophy, 
  Star, 
  TrendingUp, 
  Target, 
  Users, 
  Award,
  Zap,
  Crown,
  Calendar,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AchievementBadge } from './achievement-badge';

interface UserProfile {
  totalPoints: number;
  currentLevel: number;
  experiencePoints: number;
  nextLevelThreshold: number;
  achievementsUnlocked: number;
  bronzeCount: number;
  silverCount: number;
  goldCount: number;
  platinumCount: number;
  diamondCount: number;
  currentStreak: number;
  longestStreak: number;
  modelingStats: {
    totalModels: number;
    totalObjects: number;
    totalConnections: number;
    averageComplexity: number;
    semanticDepthScore: number;
    patternDiversityScore: number;
    consistencyScore: number;
    collaborationScore: number;
  };
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'complexity' | 'collaboration' | 'quality' | 'consistency' | 'innovation';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  iconName: string;
  color: string;
  isUnlocked: boolean;
  currentProgress: number;
  maxProgress: number;
  pointsEarned: number;
}

interface AchievementDashboardProps {
  userProfile: UserProfile;
  achievements: Achievement[];
  className?: string;
}

export function AchievementDashboard({
  userProfile,
  achievements,
  className
}: AchievementDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const levelProgress = userProfile.nextLevelThreshold > 0 
    ? (userProfile.experiencePoints / userProfile.nextLevelThreshold) * 100 
    : 100;

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const inProgressAchievements = achievements.filter(a => !a.isUnlocked && a.currentProgress > 0);
  const availableAchievements = achievements.filter(a => !a.isUnlocked && a.currentProgress === 0);

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const getLevelTitle = (level: number) => {
    if (level >= 50) return "Architecture Legend";
    if (level >= 40) return "Master Architect";
    if (level >= 30) return "Expert Modeler";
    if (level >= 20) return "Advanced Designer";
    if (level >= 10) return "Skilled Architect";
    if (level >= 5) return "Novice Modeler";
    return "Aspiring Architect";
  };

  const getLevelColor = (level: number) => {
    if (level >= 50) return "from-red-500 to-orange-500";
    if (level >= 40) return "from-cyan-400 to-blue-500";
    if (level >= 30) return "from-slate-300 to-slate-500";
    if (level >= 20) return "from-yellow-400 to-yellow-600";
    if (level >= 10) return "from-slate-400 to-slate-600";
    if (level >= 5) return "from-amber-500 to-yellow-600";
    return "from-stone-400 to-stone-600";
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* User Level & Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-lg",
                getLevelColor(userProfile.currentLevel)
              )}>
                {userProfile.currentLevel}
              </div>
              <div>
                <CardTitle className="text-xl">{getLevelTitle(userProfile.currentLevel)}</CardTitle>
                <p className="text-muted-foreground">
                  Level {userProfile.currentLevel} • {userProfile.totalPoints.toLocaleString()} Total Points
                </p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Crown className="w-4 h-4 mr-1" />
              Architect
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Experience Progress</span>
              <span>{userProfile.experiencePoints} / {userProfile.nextLevelThreshold} XP</span>
            </div>
            <Progress value={levelProgress} className="h-3" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {userProfile.achievementsUnlocked}
              </div>
              <div className="text-sm text-muted-foreground">Achievements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {userProfile.modelingStats.totalModels}
              </div>
              <div className="text-sm text-muted-foreground">Models Created</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(userProfile.modelingStats.averageComplexity)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Complexity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {userProfile.currentStreak}
              </div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { tier: 'bronze', count: userProfile.bronzeCount, color: 'text-amber-600', bg: 'bg-amber-50' },
          { tier: 'silver', count: userProfile.silverCount, color: 'text-slate-600', bg: 'bg-slate-50' },
          { tier: 'gold', count: userProfile.goldCount, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { tier: 'platinum', count: userProfile.platinumCount, color: 'text-slate-400', bg: 'bg-slate-50' },
          { tier: 'diamond', count: userProfile.diamondCount, color: 'text-cyan-600', bg: 'bg-cyan-50' }
        ].map(({ tier, count, color, bg }) => (
          <Card key={tier} className={bg}>
            <CardContent className="p-4 text-center">
              <div className={cn("text-2xl font-bold", color)}>{count}</div>
              <div className="text-sm text-muted-foreground capitalize">{tier}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievements Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Achievements
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All ({achievements.length})
            </Button>
            {['complexity', 'quality', 'collaboration', 'consistency', 'innovation'].map((category) => {
              const count = achievements.filter(a => a.category === category).length;
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category} ({count})
                </Button>
              );
            })}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="unlocked" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="unlocked">
                Unlocked ({unlockedAchievements.length})
              </TabsTrigger>
              <TabsTrigger value="progress">
                In Progress ({inProgressAchievements.length})
              </TabsTrigger>
              <TabsTrigger value="available">
                Available ({availableAchievements.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="unlocked" className="mt-4">
              <ScrollArea className="h-96">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {unlockedAchievements
                    .filter(a => selectedCategory === 'all' || a.category === selectedCategory)
                    .map((achievement) => (
                    <div key={achievement.id} className="flex flex-col items-center space-y-2">
                      <AchievementBadge
                        {...achievement}
                        isUnlocked={true}
                        size="medium"
                        showProgress={false}
                      />
                      <div className="text-center">
                        <div className="font-medium text-sm">{achievement.name}</div>
                        <Badge className="bg-green-600 text-xs">
                          +{achievement.pointsEarned}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                {unlockedAchievements.filter(a => selectedCategory === 'all' || a.category === selectedCategory).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No unlocked achievements yet. Start modeling to unlock your first achievement!
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="progress" className="mt-4">
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {inProgressAchievements
                    .filter(a => selectedCategory === 'all' || a.category === selectedCategory)
                    .map((achievement) => (
                    <Card key={achievement.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <AchievementBadge
                            {...achievement}
                            isUnlocked={false}
                            size="medium"
                            showProgress={false}
                          />
                          <div className="flex-1 space-y-2">
                            <div>
                              <h4 className="font-medium">{achievement.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {achievement.description}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span>{achievement.currentProgress}/{achievement.maxProgress}</span>
                              </div>
                              <Progress 
                                value={(achievement.currentProgress / achievement.maxProgress) * 100} 
                                className="h-2" 
                              />
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="capitalize">
                                {achievement.category}
                              </Badge>
                              <Badge variant="secondary">
                                {achievement.tier.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {inProgressAchievements.filter(a => selectedCategory === 'all' || a.category === selectedCategory).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No achievements in progress. Keep modeling to make progress!
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="available" className="mt-4">
              <ScrollArea className="h-96">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {availableAchievements
                    .filter(a => selectedCategory === 'all' || a.category === selectedCategory)
                    .map((achievement) => (
                    <div key={achievement.id} className="flex flex-col items-center space-y-2">
                      <AchievementBadge
                        {...achievement}
                        isUnlocked={false}
                        size="medium"
                        showProgress={false}
                      />
                      <div className="text-center">
                        <div className="font-medium text-sm text-muted-foreground">
                          {achievement.name}
                        </div>
                        <Badge variant="outline" className="text-xs capitalize">
                          {achievement.tier}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                {availableAchievements.filter(a => selectedCategory === 'all' || a.category === selectedCategory).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No available achievements in this category.
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}