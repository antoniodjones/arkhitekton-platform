import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Star, 
  Sparkles, 
  X,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AchievementBadge } from './achievement-badge';

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'complexity' | 'collaboration' | 'quality' | 'consistency' | 'innovation';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  iconName: string;
  color: string;
  pointsEarned: number;
  isNew?: boolean;
}

interface AchievementCelebrationProps {
  achievements: Achievement[];
  levelUp?: {
    newLevel: number;
    previousLevel: number;
    expGained: number;
  };
  onDismiss: () => void;
  visible: boolean;
}

export function AchievementCelebration({
  achievements,
  levelUp,
  onDismiss,
  visible
}: AchievementCelebrationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(!!levelUp);
  
  const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.pointsEarned, 0);
  
  useEffect(() => {
    if (visible && achievements.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % achievements.length);
      }, 3000);
      
      return () => clearInterval(timer);
    }
  }, [visible, achievements.length]);

  const confettiElements = Array.from({ length: 50 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 rounded-full"
      style={{
        backgroundColor: ['#ffd700', '#ff6b35', '#4ecdc4', '#45b7d1', '#96ceb4'][i % 5],
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      initial={{ 
        scale: 0,
        rotate: 0,
        y: -100
      }}
      animate={{ 
        scale: [0, 1, 0],
        rotate: 360,
        y: 400,
        x: Math.random() * 200 - 100
      }}
      transition={{ 
        duration: 3,
        delay: Math.random() * 2,
        repeat: Infinity,
        repeatDelay: Math.random() * 3
      }}
    />
  ));

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        data-testid="achievement-celebration-overlay"
      >
        {/* Confetti */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {confettiElements}
        </div>

        <motion.div
          className="relative max-w-md w-full mx-4"
          initial={{ scale: 0.5, y: 100 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.5, y: -100 }}
          transition={{ type: "spring", damping: 15, stiffness: 300 }}
        >
          {/* Level Up Celebration */}
          {showLevelUp && levelUp && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                <CardHeader className="text-center pb-2">
                  <motion.div
                    className="flex justify-center mb-2"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Trophy className="w-8 h-8" />
                  </motion.div>
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5" />
                    Level Up!
                    <Zap className="w-5 h-5" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-4">
                  <motion.div
                    className="text-3xl font-bold mb-2"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: 2 }}
                  >
                    Level {levelUp.newLevel}
                  </motion.div>
                  <p className="text-sm opacity-90">
                    +{levelUp.expGained} Experience Points
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-3"
                    onClick={() => setShowLevelUp(false)}
                  >
                    Continue
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Achievement Celebration */}
          {achievements.length > 0 && !showLevelUp && (
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center items-center gap-2 mb-2">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.3, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      duration: 1,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                  >
                    <Award className="w-8 h-8 text-emerald-600" />
                  </motion.div>
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                </div>
                <CardTitle className="text-emerald-800 dark:text-emerald-200">
                  Achievement{achievements.length > 1 ? 's' : ''} Unlocked!
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Achievement Display */}
                <div className="flex justify-center">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AchievementBadge
                      {...achievements[currentIndex]}
                      isUnlocked={true}
                      size="large"
                      showProgress={false}
                    />
                  </motion.div>
                </div>

                <div className="text-center">
                  <h3 className="font-bold text-lg text-emerald-800 dark:text-emerald-200 mb-1">
                    {achievements[currentIndex].name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {achievements[currentIndex].description}
                  </p>

                  <div className="flex justify-center gap-2 mb-3">
                    <Badge className="bg-emerald-600">
                      +{achievements[currentIndex].pointsEarned} Points
                    </Badge>
                    <Badge variant="outline" className="border-emerald-300">
                      {achievements[currentIndex].tier.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* Multiple achievements indicator */}
                {achievements.length > 1 && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      {currentIndex + 1} of {achievements.length} achievements
                    </p>
                    <div className="flex justify-center gap-1">
                      {achievements.map((_, index) => (
                        <motion.div
                          key={index}
                          className={cn(
                            "w-2 h-2 rounded-full",
                            index === currentIndex ? "bg-emerald-600" : "bg-muted-foreground/30"
                          )}
                          animate={{
                            scale: index === currentIndex ? 1.2 : 1
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Total points summary */}
                {achievements.length > 1 && (
                  <div className="text-center pt-2 border-t border-emerald-200">
                    <div className="flex items-center justify-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-emerald-800 dark:text-emerald-200">
                        Total: +{totalPoints} Points!
                      </span>
                    </div>
                  </div>
                )}

                {/* Close button */}
                <div className="text-center pt-2">
                  <Button 
                    onClick={onDismiss}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    data-testid="achievement-celebration-close"
                  >
                    Awesome!
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Close button (top right) */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute -top-2 -right-2 w-8 h-8 p-0 bg-muted hover:bg-muted-foreground/20 rounded-full"
            onClick={onDismiss}
            data-testid="achievement-celebration-close-x"
          >
            <X className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }, (_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                y: [-20, -100],
              }}
              transition={{
                duration: 3,
                delay: Math.random() * 2,
                repeat: Infinity,
                repeatDelay: Math.random() * 4,
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}