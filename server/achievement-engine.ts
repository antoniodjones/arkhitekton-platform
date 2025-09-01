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

// Simplicity and clarity scoring algorithms for architectural models
export class ModelSimplicityAnalyzer {
  // Calculate overall simplicity and clarity score for a model
  static calculateSimplicity(
    model: ArchitecturalModel,
    objects: ArchitecturalObject[],
    connections: ObjectConnection[]
  ): SimplicityMetrics {
    const objectCount = objects.length;
    const connectionCount = connections.length;
    
    // Simplicity: reward concise, focused architectures
    const simplicityScore = this.calculateSimplicityScore(objectCount, connectionCount);
    
    // Clarity: measure how well-documented and understandable objects are
    const clarityScore = this.calculateClarityScore(objects);
    
    // Universality: measure use of universal vs vendor-specific objects
    const universalityScore = this.calculateUniversalityScore(objects);
    
    // Transformation: measure conversion from complex to simple patterns
    const transformationScore = this.calculateTransformationScore(objects, model);
    
    // Documentation quality: comprehensive annotations and descriptions
    const documentationScore = this.calculateDocumentationScore(objects);
    
    // Overall sophistication score (rewards simplicity over complexity)
    const sophisticationScore = Math.min(100, 
      (simplicityScore * 0.25) + 
      (clarityScore * 0.25) + 
      (universalityScore * 0.20) + 
      (transformationScore * 0.15) + 
      (documentationScore * 0.15)
    );

    return {
      overallScore: Math.round(sophisticationScore * 100) / 100,
      objectCount,
      connectionCount,
      simplicityScore: Math.round(simplicityScore * 100) / 100,
      clarityScore: Math.round(clarityScore * 100) / 100,
      universalityScore: Math.round(universalityScore * 100) / 100,
      transformationScore: Math.round(transformationScore * 100) / 100,
      documentationScore: Math.round(documentationScore * 100) / 100
    };
  }

  // Calculate simplicity score (rewards concise, focused architectures)
  private static calculateSimplicityScore(objectCount: number, connectionCount: number): number {
    // Sweet spot: 5-12 objects for most architectures
    let simplicityScore = 0;
    
    if (objectCount >= 3 && objectCount <= 8) {
      simplicityScore = 100; // Perfect simplicity
    } else if (objectCount >= 9 && objectCount <= 15) {
      simplicityScore = 80; // Good balance
    } else if (objectCount >= 16 && objectCount <= 25) {
      simplicityScore = 60; // Getting complex
    } else if (objectCount > 25) {
      simplicityScore = 20; // Too complex
    } else {
      simplicityScore = 40; // Too simple
    }
    
    // Penalize excessive connections (clutter)
    const connectionRatio = objectCount > 0 ? connectionCount / objectCount : 0;
    if (connectionRatio > 2.0) {
      simplicityScore *= 0.7; // Penalty for over-connection
    }
    
    return simplicityScore;
  }

  // Calculate clarity score based on documentation quality
  private static calculateClarityScore(objects: ArchitecturalObject[]): number {
    if (objects.length === 0) return 0;
    
    const clarityScores = objects.map(obj => {
      let score = 0;
      
      // Clear, descriptive naming (not generic)
      if (obj.label && obj.label.length > 2 && !obj.label.includes('Object') && !obj.label.includes('Item')) {
        score += 25;
      }
      
      // Comprehensive description
      if (obj.description && obj.description.length > 20) {
        score += 25;
      }
      
      // Annotations present
      if (obj.annotations && obj.annotations.length > 0) {
        score += 25;
      }
      
      // Purpose is clearly defined
      if (obj.semantics?.purpose && obj.semantics.purpose.length > 10) {
        score += 25;
      }
      
      return score;
    });
    
    return clarityScores.reduce((sum, score) => sum + score, 0) / clarityScores.length;
  }

  // Calculate universality score (universal vs vendor-specific objects)
  private static calculateUniversalityScore(objects: ArchitecturalObject[]): number {
    if (objects.length === 0) return 0;
    
    const universalObjects = objects.filter(obj => {
      // Check if object uses universal/generic patterns
      const isUniversal = 
        obj.category === 'universal' || 
        obj.type?.includes('generic') ||
        (!obj.type?.includes('aws-') && 
         !obj.type?.includes('azure-') && 
         !obj.type?.includes('gcp-') &&
         !obj.type?.includes('oracle-'));
      
      return isUniversal;
    });
    
    const universalRatio = universalObjects.length / objects.length;
    return universalRatio * 100; // Higher score for more universal objects
  }

  // Calculate transformation score (evidence of simplification)
  private static calculateTransformationScore(objects: ArchitecturalObject[], model: ArchitecturalModel): number {
    let transformationScore = 0;
    
    // Look for evidence of architectural transformation
    objects.forEach(obj => {
      // Reward objects that replaced vendor-specific solutions
      if (obj.semantics?.purpose?.toLowerCase().includes('replaces') ||
          obj.semantics?.purpose?.toLowerCase().includes('simplifies') ||
          obj.semantics?.purpose?.toLowerCase().includes('consolidates')) {
        transformationScore += 20;
      }
      
      // Reward clear architectural patterns over ad-hoc solutions
      if (obj.semantics?.patterns && obj.semantics.patterns.length > 0) {
        const hasStandardPatterns = obj.semantics.patterns.some(pattern => 
          ['mvc', 'mvp', 'microservices', 'layered', 'event-driven', 'pipe-filter'].includes(pattern.toLowerCase())
        );
        if (hasStandardPatterns) transformationScore += 15;
      }
    });
    
    // Bonus for model metadata indicating transformation
    if (model.description?.toLowerCase().includes('simplified') ||
        model.description?.toLowerCase().includes('refactored') ||
        model.description?.toLowerCase().includes('modernized')) {
      transformationScore += 25;
    }
    
    return Math.min(100, transformationScore);
  }

  // Calculate documentation score
  private static calculateDocumentationScore(objects: ArchitecturalObject[]): number {
    if (objects.length === 0) return 0;
    
    const documentationScores = objects.map(obj => {
      let score = 0;
      
      // Comprehensive annotations
      if (obj.annotations && obj.annotations.length > 0) {
        score += 30;
        // Bonus for multiple annotation types
        if (obj.annotations.length >= 3) score += 10;
      }
      
      // Detailed descriptions
      if (obj.description && obj.description.length > 50) {
        score += 30;
      }
      
      // Semantic information
      if (obj.semantics?.purpose && obj.semantics.purpose.length > 20) score += 20;
      if (obj.semantics?.responsibilities && obj.semantics.responsibilities.length > 0) score += 10;
      if (obj.semantics?.constraints && obj.semantics.constraints.length > 0) score += 10;
      
      return Math.min(100, score);
    });
    
    return documentationScores.reduce((sum, score) => sum + score, 0) / documentationScores.length;
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
    const simplicity = ModelSimplicityAnalyzer.calculateSimplicity(model, objects, connections);
    const results: AchievementResult[] = [];

    for (const achievement of this.achievements) {
      const result = await this.evaluateAchievement(
        achievement,
        userId,
        model,
        simplicity,
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
    simplicity: SimplicityMetrics,
    profile?: UserGameProfile
  ): Promise<AchievementResult> {
    let progress = 0;
    let maxProgress = 1;
    let triggered = false;
    
    // Evaluate each criterion
    for (const criterion of achievement.criteria) {
      const value = this.getMetricValue(criterion.metric, simplicity, model, profile);
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
      simplicityData: simplicity
    };
  }

  // Get metric value for evaluation
  private getMetricValue(
    metric: string, 
    simplicity: SimplicityMetrics, 
    model: ArchitecturalModel,
    profile?: UserGameProfile
  ): number {
    switch (metric) {
      case 'object_count':
        return simplicity.objectCount;
      case 'connection_count':
        return simplicity.connectionCount;
      case 'simplicity_score':
        return simplicity.simplicityScore;
      case 'clarity_score':
        return simplicity.clarityScore;
      case 'universality_score':
        return simplicity.universalityScore;
      case 'transformation_score':
        return simplicity.transformationScore;
      case 'documentation_score':
        return simplicity.documentationScore;
      case 'overall_sophistication':
        return simplicity.overallScore;
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

  // Generate default achievements for the system (focused on simplification)
  static getDefaultAchievements(): Omit<Achievement, 'id' | 'createdAt'>[] {
    return [
      // Simplicity Achievements
      {
        name: "First Steps",
        description: "Create your first architectural model with clear, simple design",
        category: "simplicity",
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
        name: "Elegant Simplicity",
        description: "Create a sophisticated model with perfect simplicity (5-8 objects)",
        category: "simplicity",
        tier: "gold",
        iconName: "star",
        color: "#ffd700",
        criteria: [{ metric: "simplicity_score", threshold: 90, operator: "gte", weight: 1 }],
        basePoints: 500,
        bonusMultiplier: 2,
        prerequisites: [],
        isHidden: 0
      },
      {
        name: "Crystal Clear",
        description: "Achieve exceptional clarity with comprehensive documentation",
        category: "clarity",
        tier: "silver",
        iconName: "eye",
        color: "#c0c0c0",
        criteria: [{ metric: "clarity_score", threshold: 80, operator: "gte", weight: 1 }],
        basePoints: 300,
        bonusMultiplier: 1,
        prerequisites: [],
        isHidden: 0
      },
      {
        name: "Universal Thinker",
        description: "Use universal objects over vendor-specific solutions (80%+ universal)",
        category: "transformation",
        tier: "platinum",
        iconName: "globe",
        color: "#e5e4e2",
        criteria: [{ metric: "universality_score", threshold: 80, operator: "gte", weight: 1 }],
        basePoints: 1000,
        bonusMultiplier: 3,
        prerequisites: [],
        isHidden: 0
      },
      {
        name: "Transformation Master",
        description: "Demonstrate architectural transformation and simplification",
        category: "transformation",
        tier: "diamond",
        iconName: "sparkles",
        color: "#b9f2ff",
        criteria: [{ metric: "transformation_score", threshold: 70, operator: "gte", weight: 1 }],
        basePoints: 2000,
        bonusMultiplier: 5,
        prerequisites: [],
        isHidden: 0
      },
      {
        name: "Documentation Virtuoso",
        description: "Excel in comprehensive annotations and clear descriptions",
        category: "documentation",
        tier: "gold",
        iconName: "book",
        color: "#ffd700",
        criteria: [{ metric: "documentation_score", threshold: 85, operator: "gte", weight: 1 }],
        basePoints: 600,
        bonusMultiplier: 2,
        prerequisites: [],
        isHidden: 0
      },
      {
        name: "Sophisticated Architect",
        description: "Achieve overall sophistication through simplicity and clarity",
        category: "sophistication",
        tier: "diamond",
        iconName: "crown",
        color: "#b9f2ff",
        criteria: [{ metric: "overall_sophistication", threshold: 85, operator: "gte", weight: 1 }],
        basePoints: 1800,
        bonusMultiplier: 4,
        prerequisites: [],
        isHidden: 1
      },
      {
        name: "Clean Architecture Advocate",
        description: "Consistently create models that balance simplicity and functionality",
        category: "consistency",
        tier: "platinum",
        iconName: "shield",
        color: "#e5e4e2",
        criteria: [
          { metric: "simplicity_score", threshold: 70, operator: "gte", weight: 0.5 },
          { metric: "clarity_score", threshold: 70, operator: "gte", weight: 0.5 }
        ],
        basePoints: 1200,
        bonusMultiplier: 3,
        prerequisites: [],
        isHidden: 0
      },
      {
        name: "Prolific Simplifier",
        description: "Create 25 architectural models focusing on simplicity",
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
        name: "Dedicated Simplifier",
        description: "Maintain a 30-day streak of clear, simple modeling",
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
export interface SimplicityMetrics {
  overallScore: number;
  objectCount: number;
  connectionCount: number;
  simplicityScore: number;
  clarityScore: number;
  universalityScore: number;
  transformationScore: number;
  documentationScore: number;
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
  simplicityData: SimplicityMetrics;
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