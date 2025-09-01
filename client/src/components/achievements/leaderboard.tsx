import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  TrendingUp, 
  TrendingDown,
  Users,
  Calendar,
  Zap,
  Target,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  userId: string;
  displayName: string;
  score: number;
  rank: number;
  change: number; // +/- position change from previous period
  level: number;
  totalPoints: number;
  achievementCount: number;
  currentStreak: number;
  avatar?: string;
  title: string;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  timeframe: 'weekly' | 'monthly' | 'quarterly' | 'all-time';
  onTimeframeChange: (timeframe: 'weekly' | 'monthly' | 'quarterly' | 'all-time') => void;
  className?: string;
}

export function Leaderboard({
  entries,
  currentUserId,
  timeframe,
  onTimeframeChange,
  className
}: LeaderboardProps) {
  const [selectedTab, setSelectedTab] = useState<'points' | 'achievements' | 'streaks'>('points');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-slate-400" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-muted-foreground font-bold text-sm">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2: return 'bg-gradient-to-r from-slate-300 to-slate-500 text-white';
      case 3: return 'bg-gradient-to-r from-amber-500 to-amber-700 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-3 h-3 text-green-600" />;
    if (change < 0) return <TrendingDown className="w-3 h-3 text-red-600" />;
    return <div className="w-3 h-3" />;
  };

  const getScoreByType = (entry: LeaderboardEntry, type: 'points' | 'achievements' | 'streaks') => {
    switch (type) {
      case 'points': return entry.totalPoints;
      case 'achievements': return entry.achievementCount;
      case 'streaks': return entry.currentStreak;
      default: return entry.score;
    }
  };

  const sortEntriesByType = (type: 'points' | 'achievements' | 'streaks') => {
    return [...entries].sort((a, b) => getScoreByType(b, type) - getScoreByType(a, type));
  };

  const currentUserEntry = entries.find(entry => entry.userId === currentUserId);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            Architect Leaderboard
          </CardTitle>
          
          {/* Timeframe selector */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            {['weekly', 'monthly', 'quarterly', 'all-time'].map((period) => (
              <Button
                key={period}
                variant={timeframe === period ? "default" : "ghost"}
                size="sm"
                onClick={() => onTimeframeChange(period as any)}
                className="text-xs capitalize"
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Score type tabs */}
        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="points" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Points
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="streaks" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Streaks
            </TabsTrigger>
          </TabsList>

          {/* Current user highlight (if not in top 10) */}
          {currentUserEntry && currentUserEntry.rank > 10 && (
            <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge className={getRankBadgeColor(currentUserEntry.rank)}>
                    #{currentUserEntry.rank}
                  </Badge>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={currentUserEntry.avatar} />
                    <AvatarFallback>
                      {currentUserEntry.displayName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{currentUserEntry.displayName} (You)</div>
                    <div className="text-xs text-muted-foreground">{currentUserEntry.title}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {getScoreByType(currentUserEntry, selectedTab).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    {getChangeIcon(currentUserEntry.change)}
                    <span className={cn(
                      currentUserEntry.change > 0 && "text-green-600",
                      currentUserEntry.change < 0 && "text-red-600"
                    )}>
                      {currentUserEntry.change > 0 && '+'}
                      {currentUserEntry.change !== 0 && Math.abs(currentUserEntry.change)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <TabsContent value="points">
            <LeaderboardList entries={sortEntriesByType('points').slice(0, 10)} currentUserId={currentUserId} scoreType="points" />
          </TabsContent>

          <TabsContent value="achievements">
            <LeaderboardList entries={sortEntriesByType('achievements').slice(0, 10)} currentUserId={currentUserId} scoreType="achievements" />
          </TabsContent>

          <TabsContent value="streaks">
            <LeaderboardList entries={sortEntriesByType('streaks').slice(0, 10)} currentUserId={currentUserId} scoreType="streaks" />
          </TabsContent>
        </Tabs>

        {/* Stats summary */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{entries.length}</div>
              <div className="text-xs text-muted-foreground">Total Architects</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">
                {Math.round(entries.reduce((sum, e) => sum + e.totalPoints, 0) / entries.length).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Avg Points</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {Math.max(...entries.map(e => e.currentStreak))}
              </div>
              <div className="text-xs text-muted-foreground">Best Streak</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface LeaderboardListProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  scoreType: 'points' | 'achievements' | 'streaks';
}

function LeaderboardList({ entries, currentUserId, scoreType }: LeaderboardListProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-slate-400" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-muted-foreground font-bold text-sm">#{rank}</span>;
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-3 h-3 text-green-600" />;
    if (change < 0) return <TrendingDown className="w-3 h-3 text-red-600" />;
    return <div className="w-3 h-3" />;
  };

  const getScoreByType = (entry: LeaderboardEntry, type: 'points' | 'achievements' | 'streaks') => {
    switch (type) {
      case 'points': return entry.totalPoints;
      case 'achievements': return entry.achievementCount;
      case 'streaks': return entry.currentStreak;
      default: return entry.score;
    }
  };

  const getScoreLabel = (type: 'points' | 'achievements' | 'streaks') => {
    switch (type) {
      case 'points': return 'pts';
      case 'achievements': return 'achievements';
      case 'streaks': return 'day streak';
      default: return '';
    }
  };

  return (
    <div className="space-y-2">
      {entries.map((entry, index) => (
        <div
          key={entry.userId}
          className={cn(
            "flex items-center justify-between p-3 rounded-lg transition-colors",
            entry.userId === currentUserId ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/50",
            index < 3 && "bg-gradient-to-r from-muted/50 to-transparent"
          )}
        >
          <div className="flex items-center gap-3">
            {getRankIcon(index + 1)}
            <Avatar className="w-10 h-10">
              <AvatarImage src={entry.avatar} />
              <AvatarFallback className="text-sm">
                {entry.displayName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-sm flex items-center gap-2">
                {entry.displayName}
                {entry.userId === currentUserId && (
                  <Badge variant="outline" className="text-xs">You</Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <span>{entry.title}</span>
                <span>•</span>
                <span>Level {entry.level}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="font-bold text-lg">
              {getScoreByType(entry, scoreType).toLocaleString()}
            </div>
            <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
              <span>{getScoreLabel(scoreType)}</span>
              {getChangeIcon(entry.change)}
              <span className={cn(
                entry.change > 0 && "text-green-600",
                entry.change < 0 && "text-red-600"
              )}>
                {entry.change > 0 && '+'}
                {entry.change !== 0 && Math.abs(entry.change)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}