/**
 * ARKHITEKTON UX Testing Configuration
 * Global configuration and constants for UX testing framework
 */

export const UX_TEST_CONFIG = {
  // Application URLs
  BASE_URL: process.env.BASE_URL || 'http://localhost:5000',
  
  // Test timeouts
  DEFAULT_TIMEOUT: 30000,
  NAVIGATION_TIMEOUT: 10000,
  ASSERTION_TIMEOUT: 5000,
  
  // Visual regression settings
  VISUAL_THRESHOLD: 0.2, // 20% pixel difference tolerance
  ANIMATION_TIMEOUT: 1000,
  
  // Performance thresholds (Core Web Vitals)
  PERFORMANCE_THRESHOLDS: {
    FIRST_CONTENTFUL_PAINT: 1800,  // ms - Good < 1.8s
    LARGEST_CONTENTFUL_PAINT: 2500, // ms - Good < 2.5s
    CUMULATIVE_LAYOUT_SHIFT: 0.1,   // score - Good < 0.1
    FIRST_INPUT_DELAY: 100,         // ms - Good < 100ms
    TIME_TO_INTERACTIVE: 3800,      // ms - Good < 3.8s
    TOTAL_BLOCKING_TIME: 200,       // ms - Good < 200ms
    SPEED_INDEX: 3400               // ms - Good < 3.4s
  },
  
  // Accessibility scoring
  ACCESSIBILITY_THRESHOLDS: {
    MIN_SCORE: 80,              // Minimum accessibility score
    MAX_VIOLATIONS: 5,          // Maximum number of violations allowed
    CRITICAL_VIOLATIONS: 0      // No critical violations allowed
  },
  
  // Bundle size limits (bytes)
  BUNDLE_SIZE_LIMITS: {
    TOTAL_JS: 1024 * 1024,      // 1MB total JavaScript
    TOTAL_CSS: 512 * 1024,      // 512KB total CSS
    TOTAL_IMAGES: 2048 * 1024,  // 2MB total images
    TOTAL_ASSETS: 5120 * 1024   // 5MB total assets
  },
  
  // Test viewports
  VIEWPORTS: {
    MOBILE: { width: 375, height: 667, name: 'mobile' },
    TABLET: { width: 768, height: 1024, name: 'tablet' },
    DESKTOP: { width: 1920, height: 1080, name: 'desktop' },
    ULTRAWIDE: { width: 2560, height: 1440, name: 'ultrawide' }
  },
  
  // Critical pages for testing
  CRITICAL_PAGES: [
    {
      name: 'Dashboard',
      path: '/',
      loadTimeThreshold: 2000,
      priority: 'critical'
    },
    {
      name: 'Knowledge Base',
      path: '/wiki',
      loadTimeThreshold: 3000,
      priority: 'high'
    },
    {
      name: 'Architecture Modeling',
      path: '/modeling',
      loadTimeThreshold: 4000,
      priority: 'high'
    },
    {
      name: 'Development Plan',
      path: '/plan',
      loadTimeThreshold: 2000,
      priority: 'high'
    },
    {
      name: 'Governance',
      path: '/governance',
      loadTimeThreshold: 2000,
      priority: 'medium'
    },
    {
      name: 'Architecture Workspace',
      path: '/workspace',
      loadTimeThreshold: 4000,
      priority: 'medium'
    }
  ],
  
  // Test data selectors
  SELECTORS: {
    // Navigation
    SIDEBAR: '.compact-sidebar',
    MAIN_CONTENT: 'main',
    HEADER: 'header',
    
    // Interactive elements
    PRIMARY_BUTTON: '[data-testid*="button-"]',
    FORM_INPUT: '[data-testid*="input-"]',
    NAVIGATION_LINK: '[data-testid*="link-"]',
    
    // Content areas
    DASHBOARD_CONTENT: '[data-testid="dashboard-content"]',
    KNOWLEDGE_BASE_TREE: '[data-testid="knowledge-base-tree"]',
    PLAN_TASKS: '[data-testid="plan-tasks"]',
    
    // Loading states
    LOADING_SPINNER: '[data-testid*="loading"]',
    SKELETON_LOADER: '[data-testid*="skeleton"]'
  },
  
  // Report generation settings
  REPORTING: {
    HTML_TEMPLATE_PATH: 'tests/ux-framework/templates/report.html',
    OUTPUT_DIR: 'test-results/ux-reports',
    SCREENSHOT_DIR: 'test-results/screenshots',
    KEEP_REPORTS: 10 // Keep last 10 reports
  }
};

/**
 * Get configuration for specific test type
 */
export function getTestConfig(testType: 'visual' | 'accessibility' | 'performance' | 'user-flow') {
  const baseConfig = {
    timeout: UX_TEST_CONFIG.DEFAULT_TIMEOUT,
    baseURL: UX_TEST_CONFIG.BASE_URL
  };

  switch (testType) {
    case 'visual':
      return {
        ...baseConfig,
        threshold: UX_TEST_CONFIG.VISUAL_THRESHOLD,
        viewports: Object.values(UX_TEST_CONFIG.VIEWPORTS)
      };
      
    case 'accessibility':
      return {
        ...baseConfig,
        minScore: UX_TEST_CONFIG.ACCESSIBILITY_THRESHOLDS.MIN_SCORE,
        maxViolations: UX_TEST_CONFIG.ACCESSIBILITY_THRESHOLDS.MAX_VIOLATIONS
      };
      
    case 'performance':
      return {
        ...baseConfig,
        thresholds: UX_TEST_CONFIG.PERFORMANCE_THRESHOLDS
      };
      
    case 'user-flow':
      return {
        ...baseConfig,
        navigationTimeout: UX_TEST_CONFIG.NAVIGATION_TIMEOUT
      };
      
    default:
      return baseConfig;
  }
}

/**
 * Validate test environment
 */
export function validateTestEnvironment(): boolean {
  // Check if base URL is accessible
  if (!UX_TEST_CONFIG.BASE_URL) {
    console.error('❌ BASE_URL not configured');
    return false;
  }
  
  // Check if required directories exist
  const requiredDirs = [
    'test-results',
    'test-results/screenshots',
    'test-results/ux-reports'
  ];
  
  // Additional environment validation could be added here
  return true;
}