import { 
  ArchitecturalModel, 
  ArchitecturalObject, 
  ObjectConnection,
  Achievement,
  UserAchievement,
  UserGameProfile,
  InsertUserAchievement,
  InsertUserGameProfile 
} from '@shared/schema';

// Complexity scoring algorithms for architectural models
export class ModelComplexityAnalyzer {
  // Calculate overall complexity score for a model
  static calculateComplexity(
    model: ArchitecturalModel,
    objects: ArchitecturalObject[],
    connections: ObjectConnection[]
  ): ComplexityMetrics {
    const objectCount = objects.length;
    const connectionCount = connections.length;
    
    // Connection density: connections per object ratio
    const connectionDensity = objectCount > 0 ? connectionCount / objectCount : 0;
    
    // Semantic depth: average semantic richness across objects
    const semanticDepth = this.calculateSemanticDepth(objects);
    
    // Pattern diversity: unique architectural patterns used
    const patternDiversity = this.calculatePatternDiversity(objects);
    
    // Domain diversity: spread across different architectural domains
    const domainDiversity = this.calculateDomainDiversity(objects);
    
    // Implementation linkage: objects linked to real implementations
    const implementationLinkage = this.calculateImplementationLinkage(objects);
    
    // Overall complexity score (0-100)
    const complexityScore = Math.min(100, 
      (objectCount * 2) + 
      (connectionDensity * 15) + 
      (semanticDepth * 20) + 
      (patternDiversity * 15) + 
      (domainDiversity * 10) + 
      (implementationLinkage * 10)
    );

    return {
      overallScore: Math.round(complexityScore * 100) / 100,
      objectCount,
      connectionCount,
      connectionDensity: Math.round(connectionDensity * 100) / 100,
      semanticDepth: Math.round(semanticDepth * 100) / 100,
      patternDiversity: Math.round(patternDiversity * 100) / 100,
      domainDiversity: Math.round(domainDiversity * 100) / 100,
      implementationLinkage: Math.round(implementationLinkage * 100) / 100
    };
  }

  // Calculate semantic richness based on object properties
  private static calculateSemanticDepth(objects: ArchitecturalObject[]): number {
    if (objects.length === 0) return 0;
    
    const totalDepth = objects.reduce((sum, obj) => {
      let depth = 0;
      
      // Semantic properties scoring
      if (obj.semantics?.purpose && obj.semantics.purpose.length > 10) depth += 1;
      if (obj.semantics?.responsibilities && obj.semantics.responsibilities.length > 0) {
        depth += Math.min(3, obj.semantics.responsibilities.length * 0.5);
      }
      if (obj.semantics?.constraints && obj.semantics.constraints.length > 0) {
        depth += Math.min(2, obj.semantics.constraints.length * 0.3);
      }
      if (obj.semantics?.patterns && obj.semantics.patterns.length > 0) {
        depth += Math.min(2, obj.semantics.patterns.length * 0.4);
      }
      
      // Metrics scoring
      if (obj.metrics && Object.keys(obj.metrics).length > 0) depth += 1;
      
      // Implementation linkage scoring
      if (obj.implementation && Object.keys(obj.implementation).length > 0) depth += 1;
      
      return sum + Math.min(10, depth); // Cap individual object depth at 10
    }, 0);
    
    return totalDepth / objects.length;
  }

  // Calculate architectural pattern diversity
  private static calculatePatternDiversity(objects: ArchitecturalObject[]): number {
    const allPatterns = new Set<string>();
    
    objects.forEach(obj => {
      if (obj.semantics?.patterns) {
        obj.semantics.patterns.forEach(pattern => allPatterns.add(pattern.toLowerCase()));
      }
    });
    
    // Score based on pattern count and diversity
    return Math.min(10, allPatterns.size * 0.8);
  }

  // Calculate domain diversity across architectural layers
  private static calculateDomainDiversity(objects: ArchitecturalObject[]): number {
    const domains = new Set(objects.map(obj => obj.domain));
    const categories = new Set(objects.map(obj => obj.category));
    
    // Score for having objects across multiple domains and categories
    return Math.min(10, (domains.size * 2) + (categories.size * 1));
  }

  // Calculate implementation linkage score
  private static calculateImplementationLinkage(objects: ArchitecturalObject[]): number {
    if (objects.length === 0) return 0;
    
    const linkedObjects = objects.filter(obj => {
      const impl = obj.implementation;
      return impl && (
        (impl.codeRepositories && impl.codeRepositories.length > 0) ||
        (impl.deployments && impl.deployments.length > 0) ||
        (impl.infrastructure && impl.infrastructure.length > 0) ||
        (impl.apis && impl.apis.length > 0)
      );
    });
    
    return (linkedObjects.length / objects.length) * 10;
  }
}

// Achievement evaluation engine
export class AchievementEngine {
  private achievements: Achievement[] = [];
  
  constructor(achievements: Achievement[]) {
    this.achievements = achievements;
  }

  // Evaluate all achievements for a user's model
  async evaluateAchievements(
    userId: string,
    model: ArchitecturalModel,
    objects: ArchitecturalObject[],
    connections: ObjectConnection[],
    currentProfile?: UserGameProfile
  ): Promise<AchievementResult[]> {
    const complexity = ModelComplexityAnalyzer.calculateComplexity(model, objects, connections);
    const results: AchievementResult[] = [];

    for (const achievement of this.achievements) {
      const result = await this.evaluateAchievement(
        achievement,
        userId,
        model,
        complexity,
        currentProfile
      );
      
      if (result.triggered || result.progressMade) {
        results.push(result);
      }
    }

    return results;
  }

  // Evaluate individual achievement
  private async evaluateAchievement(
    achievement: Achievement,
    userId: string,
    model: ArchitecturalModel,
    complexity: ComplexityMetrics,
    profile?: UserGameProfile
  ): Promise<AchievementResult> {
    let progress = 0;
    let maxProgress = 1;
    let triggered = false;
    
    // Evaluate each criterion
    for (const criterion of achievement.criteria) {
      const value = this.getMetricValue(criterion.metric, complexity, model, profile);
      const threshold = criterion.threshold;
      
      let criterionMet = false;
      switch (criterion.operator) {
        case 'gte':
          criterionMet = value >= threshold;
          progress = Math.min(threshold, value);
          maxProgress = threshold;
          break;
        case 'lte':
          criterionMet = value <= threshold;
          progress = threshold - Math.max(0, value - threshold);
          maxProgress = threshold;
          break;
        case 'eq':
          criterionMet = value === threshold;
          progress = criterionMet ? threshold : Math.abs(value - threshold);
          maxProgress = threshold;
          break;
      }
      
      if (criterionMet) {
        triggered = true;
      }
    }

    return {
      achievementId: achievement.id,
      userId,
      modelId: model.id,
      triggered,
      progressMade: progress > 0,
      currentProgress: Math.round(progress),
      maxProgress: Math.round(maxProgress),
      pointsEarned: triggered ? achievement.basePoints : 0,
      complexityData: complexity
    };
  }

  // Get metric value for evaluation
  private getMetricValue(
    metric: string, 
    complexity: ComplexityMetrics, 
    model: ArchitecturalModel,
    profile?: UserGameProfile
  ): number {
    switch (metric) {
      case 'object_count':
        return complexity.objectCount;
      case 'connection_count':
        return complexity.connectionCount;
      case 'connection_density':
        return complexity.connectionDensity;
      case 'semantic_depth':
        return complexity.semanticDepth;
      case 'pattern_diversity':
        return complexity.patternDiversity;
      case 'domain_diversity':
        return complexity.domainDiversity;
      case 'implementation_linkage':
        return complexity.implementationLinkage;
      case 'overall_complexity':
        return complexity.overallScore;
      case 'total_models':
        return profile?.modelingStats?.totalModels || 0;
      case 'user_level':
        return profile?.currentLevel || 1;
      case 'current_streak':
        return profile?.currentStreak || 0;
      case 'collaboration_score':
        return profile?.modelingStats?.collaborationScore || 0;
      default:
        return 0;
    }
  }

  // Generate default achievements for the system
  static getDefaultAchievements(): Omit<Achievement, 'id' | 'createdAt'>[] {
    return [
      // Complexity Achievements
      {
        name: "First Steps",
        description: "Create your first architectural model with at least 3 objects",
        category: "complexity",
        tier: "bronze",
        iconName: "baby",
        color: "#cd7f32",
        criteria: [{ metric: "object_count", threshold: 3, operator: "gte", weight: 1 }],
        basePoints: 50,
        bonusMultiplier: 1,
        prerequisites: [],
        isHidden: 0
      },
      {
        name: "Growing Architecture",
        description: "Build a model with 10+ architectural objects",
        category: "complexity",
        tier: "bronze",
        iconName: "building",
        color: "#cd7f32",
        criteria: [{ metric: "object_count", threshold: 10, operator: "gte", weight: 1 }],
        basePoints: 100,
        bonusMultiplier: 1,
        prerequisites: [],
        isHidden: 0
      },
      {
        name: "Connected Thinking",
        description: "Create a model with high connection density (2+ connections per object)",
        category: "complexity",
        tier: "silver",
        iconName: "network",
        color: "#c0c0c0",
        criteria: [{ metric: "connection_density", threshold: 2, operator: "gte", weight: 1 }],
        basePoints: 200,
        bonusMultiplier: 1,
        prerequisites: [],
        isHidden: 0
      },
      {
        name: "Semantic Master",
        description: "Achieve high semantic depth (7+) with rich object descriptions",
        category: "quality",
        tier: "gold",
        iconName: "brain",
        color: "#ffd700",
        criteria: [{ metric: "semantic_depth", threshold: 7, operator: "gte", weight: 1 }],
        basePoints: 500,
        bonusMultiplier: 2,
        prerequisites: [],
        isHidden: 0
      },
      {
        name: "Pattern Virtuoso",
        description: "Use 8+ different architectural patterns in a single model",
        category: "quality",
        tier: "gold",
        iconName: "puzzle",
        color: "#ffd700",
        criteria: [{ metric: "pattern_diversity", threshold: 8, operator: "gte", weight: 1 }],
        basePoints: 600,
        bonusMultiplier: 2,
        prerequisites: [],
        isHidden: 0
      },
      {
        name: "Multi-Domain Expert",
        description: "Create a model spanning multiple architectural domains",
        category: "consistency",
        tier: "silver",
        iconName: "layers",
        color: "#c0c0c0",
        criteria: [{ metric: "domain_diversity", threshold: 8, operator: "gte", weight: 1 }],
        basePoints: 300,
        bonusMultiplier: 1,
        prerequisites: [],
        isHidden: 0
      },
      {
        name: "Implementation Pioneer",
        description: "Link 80%+ of your objects to real implementations",
        category: "innovation",
        tier: "platinum",
        iconName: "link",
        color: "#e5e4e2",
        criteria: [{ metric: "implementation_linkage", threshold: 8, operator: "gte", weight: 1 }],
        basePoints: 1000,
        bonusMultiplier: 3,
        prerequisites: [],
        isHidden: 0
      },
      {
        name: "Complexity Champion",
        description: "Achieve maximum complexity score (90+) in a single model",
        category: "complexity",
        tier: "diamond",
        iconName: "crown",
        color: "#b9f2ff",
        criteria: [{ metric: "overall_complexity", threshold: 90, operator: "gte", weight: 1 }],
        basePoints: 2000,
        bonusMultiplier: 5,
        prerequisites: [],
        isHidden: 1
      },
      {
        name: "Prolific Architect",
        description: "Create 25 architectural models",
        category: "collaboration",
        tier: "gold",
        iconName: "trophy",
        color: "#ffd700",
        criteria: [{ metric: "total_models", threshold: 25, operator: "gte", weight: 1 }],
        basePoints: 800,
        bonusMultiplier: 2,
        prerequisites: [],
        isHidden: 0
      },
      {
        name: "Dedicated Modeler",
        description: "Maintain a 30-day modeling streak",
        category: "collaboration",
        tier: "platinum",
        iconName: "flame",
        color: "#e5e4e2",
        criteria: [{ metric: "current_streak", threshold: 30, operator: "gte", weight: 1 }],
        basePoints: 1500,
        bonusMultiplier: 3,
        prerequisites: [],
        isHidden: 0
      }
    ];
  }
}

// Level progression system
export class LevelSystem {
  // Calculate required experience points for level
  static getExpRequiredForLevel(level: number): number {
    // Exponential progression: level^2 * 100
    return level * level * 100;
  }

  // Calculate level from total experience points
  static getLevelFromExp(totalExp: number): number {
    let level = 1;
    while (this.getExpRequiredForLevel(level + 1) <= totalExp) {
      level++;
    }
    return level;
  }

  // Get level progression info
  static getLevelProgress(currentExp: number): LevelProgress {
    const currentLevel = this.getLevelFromExp(currentExp);
    const nextLevelExp = this.getExpRequiredForLevel(currentLevel + 1);
    const currentLevelExp = this.getExpRequiredForLevel(currentLevel);
    const progressToNext = currentExp - currentLevelExp;
    const expNeededForNext = nextLevelExp - currentLevelExp;

    return {
      currentLevel,
      nextLevel: currentLevel + 1,
      currentExp,
      expForCurrentLevel: currentLevelExp,
      expForNextLevel: nextLevelExp,
      progressToNext,
      expNeededForNext,
      progressPercentage: Math.round((progressToNext / expNeededForNext) * 100)
    };
  }

  // Get level tier and title
  static getLevelInfo(level: number): LevelInfo {
    if (level >= 50) return { tier: "legendary", title: "Architecture Legend", color: "#ff6b35" };
    if (level >= 40) return { tier: "master", title: "Master Architect", color: "#b9f2ff" };
    if (level >= 30) return { tier: "expert", title: "Expert Modeler", color: "#e5e4e2" };
    if (level >= 20) return { tier: "advanced", title: "Advanced Designer", color: "#ffd700" };
    if (level >= 10) return { tier: "intermediate", title: "Skilled Architect", color: "#c0c0c0" };
    if (level >= 5) return { tier: "novice", title: "Novice Modeler", color: "#cd7f32" };
    return { tier: "beginner", title: "Aspiring Architect", color: "#8b7355" };
  }
}

// Type definitions
export interface ComplexityMetrics {
  overallScore: number;
  objectCount: number;
  connectionCount: number;
  connectionDensity: number;
  semanticDepth: number;
  patternDiversity: number;
  domainDiversity: number;
  implementationLinkage: number;
}

export interface AchievementResult {
  achievementId: string;
  userId: string;
  modelId: string;
  triggered: boolean;
  progressMade: boolean;
  currentProgress: number;
  maxProgress: number;
  pointsEarned: number;
  complexityData: ComplexityMetrics;
}

export interface LevelProgress {
  currentLevel: number;
  nextLevel: number;
  currentExp: number;
  expForCurrentLevel: number;
  expForNextLevel: number;
  progressToNext: number;
  expNeededForNext: number;
  progressPercentage: number;
}

export interface LevelInfo {
  tier: string;
  title: string;
  color: string;
}