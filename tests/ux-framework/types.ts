/**
 * ARKHITEKTON UX Testing Framework Types
 * Type definitions for comprehensive UX testing
 */

export interface TestViewport {
  name: string;
  width: number;
  height: number;
  deviceScaleFactor?: number;
}

export interface VisualTestConfig {
  threshold: number;
  animations: 'disabled' | 'allow';
  clip?: { x: number; y: number; width: number; height: number };
  fullPage?: boolean;
}

export interface AccessibilityResult {
  violations: Array<{
    id: string;
    impact: 'minor' | 'moderate' | 'serious' | 'critical';
    description: string;
    nodes: Array<{
      target: string[];
      html: string;
    }>;
  }>;
  passes: number;
  violations_count: number;
  score: number; // 0-100
}

export interface PerformanceMetrics {
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
  totalBlockingTime: number;
  speedIndex: number;
  performanceScore: number; // 0-100
}

export interface UserFlowStep {
  name: string;
  action: 'click' | 'type' | 'select' | 'navigate' | 'wait' | 'scroll';
  selector?: string;
  text?: string;
  url?: string;
  timeout?: number;
  screenshot?: boolean;
}

export interface UserFlow {
  name: string;
  description: string;
  steps: UserFlowStep[];
  expectedOutcome: string;
}

export interface UXTestResult {
  timestamp: string;
  testSuite: string;
  viewport: TestViewport;
  visual?: {
    passed: boolean;
    differences: number;
    threshold: number;
  };
  accessibility?: AccessibilityResult;
  performance?: PerformanceMetrics;
  userFlow?: {
    passed: boolean;
    completedSteps: number;
    totalSteps: number;
    error?: string;
  };
}

export interface TestReport {
  summary: {
    totalTests: number;
    passed: number;
    failed: number;
    overallScore: number;
  };
  results: UXTestResult[];
  recommendations: string[];
  generatedAt: string;
}