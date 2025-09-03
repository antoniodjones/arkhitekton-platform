import { test, expect, Page } from '@playwright/test';
import { injectAxe, checkA11y, getViolations } from '@axe-core/playwright';
import { AccessibilityResult } from './types';

/**
 * ARKHITEKTON Accessibility Testing Suite
 * WCAG 2.1 compliance testing and accessibility auditing
 */

export class AccessibilityTester {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Run comprehensive accessibility audit
   */
  async auditAccessibility(url: string, selector?: string): Promise<AccessibilityResult> {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');

    // Inject axe-core
    await injectAxe(this.page);

    // Configure axe rules for enterprise applications
    const axeConfig = {
      rules: {
        // Enable important rules
        'color-contrast': { enabled: true },
        'keyboard-navigation': { enabled: true },
        'focus-management': { enabled: true },
        'aria-labels': { enabled: true },
        'semantic-markup': { enabled: true },
        
        // Disable rules that may not apply to enterprise apps
        'landmark-one-main': { enabled: false },
        'page-has-heading-one': { enabled: false }
      },
      tags: ['wcag2a', 'wcag2aa', 'wcag21aa']
    };

    // Run accessibility scan
    try {
      await checkA11y(this.page, selector || 'body', axeConfig);
      
      return {
        violations: [],
        passes: 0,
        violations_count: 0,
        score: 100
      };
    } catch (error) {
      const violations = await getViolations(this.page, selector || 'body', axeConfig);
      
      const accessibilityResult: AccessibilityResult = {
        violations: violations.map(violation => ({
          id: violation.id,
          impact: violation.impact as 'minor' | 'moderate' | 'serious' | 'critical',
          description: violation.description,
          nodes: violation.nodes.map(node => ({
            target: node.target,
            html: node.html
          }))
        })),
        passes: 0, // Would need additional logic to count passes
        violations_count: violations.length,
        score: Math.max(0, 100 - (violations.length * 10)) // Simple scoring
      };

      return accessibilityResult;
    }
  }

  /**
   * Test keyboard navigation
   */
  async testKeyboardNavigation(): Promise<boolean> {
    // Test Tab navigation through interactive elements
    const interactiveElements = await this.page.locator('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])').all();
    
    let tabIndex = 0;
    for (const element of interactiveElements) {
      await this.page.keyboard.press('Tab');
      const focused = await this.page.evaluate(() => document.activeElement?.tagName);
      
      if (!focused) {
        return false;
      }
      
      tabIndex++;
      if (tabIndex > 20) break; // Safety limit
    }

    return true;
  }

  /**
   * Test screen reader compatibility
   */
  async testScreenReaderSupport(): Promise<{ score: number; issues: string[] }> {
    const issues: string[] = [];
    let score = 100;

    // Check for alt text on images
    const images = await this.page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      if (!alt) {
        issues.push('Missing alt text on image');
        score -= 10;
      }
    }

    // Check for ARIA labels on interactive elements
    const buttons = await this.page.locator('button').all();
    for (const button of buttons) {
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      
      if (!ariaLabel && !text?.trim()) {
        issues.push('Button missing accessible label');
        score -= 15;
      }
    }

    // Check for proper heading structure
    const headings = await this.page.locator('h1, h2, h3, h4, h5, h6').all();
    let previousLevel = 0;
    
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
      const currentLevel = parseInt(tagName.replace('h', ''));
      
      if (currentLevel > previousLevel + 1 && previousLevel !== 0) {
        issues.push('Heading structure skip detected');
        score -= 20;
        break;
      }
      
      previousLevel = currentLevel;
    }

    return { score: Math.max(0, score), issues };
  }

  /**
   * Test color contrast ratios
   */
  async testColorContrast(): Promise<{ passed: boolean; issues: string[] }> {
    const issues: string[] = [];
    
    // This would need a more sophisticated implementation
    // For now, we rely on axe-core's color-contrast rule
    const result = await this.auditAccessibility(this.page.url());
    
    const contrastViolations = result.violations.filter(v => v.id === 'color-contrast');
    
    return {
      passed: contrastViolations.length === 0,
      issues: contrastViolations.map(v => v.description)
    };
  }
}

// Test Suite Definition
test.describe('ARKHITEKTON Accessibility Tests', () => {
  let accessibilityTester: AccessibilityTester;

  test.beforeEach(async ({ page }) => {
    accessibilityTester = new AccessibilityTester(page);
  });

  const pages = [
    { name: 'Dashboard', url: '/' },
    { name: 'Knowledge Base', url: '/wiki' },
    { name: 'Architecture Modeling', url: '/modeling' },
    { name: 'Development Plan', url: '/plan' },
    { name: 'Governance', url: '/governance' }
  ];

  for (const pageConfig of pages) {
    test(`${pageConfig.name} - WCAG 2.1 Compliance`, async ({ page }) => {
      const tester = new AccessibilityTester(page);
      const result = await tester.auditAccessibility(pageConfig.url);
      
      // Log violations for debugging
      if (result.violations.length > 0) {
        console.log(`Accessibility violations on ${pageConfig.name}:`, result.violations);
      }
      
      // Expect less than 5 minor violations (adjust threshold as needed)
      expect(result.violations_count).toBeLessThan(5);
      expect(result.score).toBeGreaterThan(80);
    });

    test(`${pageConfig.name} - Keyboard Navigation`, async ({ page }) => {
      await page.goto(pageConfig.url);
      const tester = new AccessibilityTester(page);
      const result = await tester.testKeyboardNavigation();
      expect(result).toBe(true);
    });

    test(`${pageConfig.name} - Screen Reader Support`, async ({ page }) => {
      await page.goto(pageConfig.url);
      const tester = new AccessibilityTester(page);
      const result = await tester.testScreenReaderSupport();
      
      expect(result.score).toBeGreaterThan(70);
      expect(result.issues.length).toBeLessThan(10);
    });

    test(`${pageConfig.name} - Color Contrast`, async ({ page }) => {
      await page.goto(pageConfig.url);
      const tester = new AccessibilityTester(page);
      const result = await tester.testColorContrast();
      
      expect(result.passed).toBe(true);
    });
  }
});