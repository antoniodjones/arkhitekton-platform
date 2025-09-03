import { test, expect, Page } from '@playwright/test';
import { TestViewport, VisualTestConfig, UXTestResult } from './types';

/**
 * ARKHITEKTON Visual Regression Testing Suite
 * Automated screenshot comparison and visual diff detection
 */

export class VisualRegressionTester {
  private page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Capture and compare screenshots for key ARKHITEKTON pages
   */
  async testPageVisuals(
    pageName: string, 
    url: string, 
    viewport: TestViewport,
    config: VisualTestConfig = { threshold: 0.2, animations: 'disabled' }
  ): Promise<boolean> {
    // Set viewport
    await this.page.setViewportSize({
      width: viewport.width,
      height: viewport.height
    });

    // Navigate to page
    await this.page.goto(url);

    // Wait for page to stabilize
    await this.page.waitForLoadState('networkidle');
    
    // Disable animations for consistent screenshots
    if (config.animations === 'disabled') {
      await this.page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation-delay: -1ms !important;
            animation-duration: 1ms !important;
            animation-iteration-count: 1 !important;
            background-attachment: initial !important;
            scroll-behavior: auto !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
          }
        `
      });
    }

    // Wait for fonts and images to load
    await this.page.waitForTimeout(1000);

    // Take screenshot and compare
    const screenshotName = `${pageName}-${viewport.name}.png`;
    
    await expect(this.page).toHaveScreenshot(screenshotName, {
      threshold: config.threshold,
      fullPage: config.fullPage ?? false,
      clip: config.clip,
      animations: 'disabled',
    });

    return true;
  }

  /**
   * Test responsive design across multiple breakpoints
   */
  async testResponsiveDesign(url: string): Promise<UXTestResult[]> {
    const viewports: TestViewport[] = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 },
      { name: 'ultrawide', width: 2560, height: 1440 }
    ];

    const results: UXTestResult[] = [];

    for (const viewport of viewports) {
      try {
        await this.testPageVisuals(`responsive-${url.split('/').pop()}`, url, viewport);
        
        results.push({
          timestamp: new Date().toISOString(),
          testSuite: 'visual-regression',
          viewport,
          visual: { passed: true, differences: 0, threshold: 0.2 }
        });
      } catch (error) {
        results.push({
          timestamp: new Date().toISOString(),
          testSuite: 'visual-regression',
          viewport,
          visual: { passed: false, differences: -1, threshold: 0.2 }
        });
      }
    }

    return results;
  }

  /**
   * Test component visual consistency
   */
  async testComponentLibrary(): Promise<void> {
    const components = [
      { selector: '[data-testid="button-submit"]', name: 'primary-button' },
      { selector: '[data-testid="input-email"]', name: 'text-input' },
      { selector: '.compact-sidebar', name: 'navigation-sidebar' },
      { selector: '[data-testid="card-product"]', name: 'content-card' }
    ];

    for (const component of components) {
      const element = this.page.locator(component.selector).first();
      if (await element.isVisible()) {
        await expect(element).toHaveScreenshot(`component-${component.name}.png`, {
          threshold: 0.1
        });
      }
    }
  }
}

// Test Suite Definition
test.describe('ARKHITEKTON Visual Regression Tests', () => {
  let visualTester: VisualRegressionTester;

  test.beforeEach(async ({ page }) => {
    visualTester = new VisualRegressionTester(page);
  });

  const criticalPages = [
    { name: 'dashboard', url: '/' },
    { name: 'knowledge-base', url: '/wiki' },
    { name: 'architecture-modeling', url: '/modeling' },
    { name: 'development-plan', url: '/plan' },
    { name: 'governance', url: '/governance' }
  ];

  // Test each critical page across different viewports
  for (const pageConfig of criticalPages) {
    test(`${pageConfig.name} - Desktop Visual Test`, async ({ page }) => {
      const tester = new VisualRegressionTester(page);
      await tester.testPageVisuals(
        pageConfig.name,
        pageConfig.url,
        { name: 'desktop', width: 1920, height: 1080 }
      );
    });

    test(`${pageConfig.name} - Mobile Visual Test`, async ({ page }) => {
      const tester = new VisualRegressionTester(page);
      await tester.testPageVisuals(
        pageConfig.name,
        pageConfig.url,
        { name: 'mobile', width: 375, height: 667 }
      );
    });
  }

  test('Component Library Visual Consistency', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const tester = new VisualRegressionTester(page);
    await tester.testComponentLibrary();
  });
});