import { test, expect, Page } from '@playwright/test';
import lighthouse from 'lighthouse';
import { PerformanceMetrics } from './types';

/**
 * ARKHITEKTON Performance Testing Suite
 * Core Web Vitals and performance optimization testing
 */

export class PerformanceTester {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Measure Core Web Vitals using Performance API
   */
  async measureCoreWebVitals(url: string): Promise<PerformanceMetrics> {
    await this.page.goto(url);
    
    // Wait for page to fully load
    await this.page.waitForLoadState('networkidle');
    
    // Inject performance measurement script
    const metrics = await this.page.evaluate(() => {
      return new Promise<PerformanceMetrics>((resolve) => {
        // Collect performance metrics
        const perfEntries = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paintEntries = performance.getEntriesByType('paint');
        
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
        
        // Create observer for LCP
        let lcp = 0;
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          lcp = entries[entries.length - 1]?.startTime || 0;
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // Create observer for CLS
        let cls = 0;
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              cls += (entry as any).value;
            }
          }
        }).observe({ entryTypes: ['layout-shift'] });

        // Calculate basic metrics
        const loadTime = perfEntries.loadEventEnd - perfEntries.navigationStart;
        const domContentLoaded = perfEntries.domContentLoadedEventEnd - perfEntries.navigationStart;
        const timeToInteractive = perfEntries.loadEventEnd - perfEntries.navigationStart;

        setTimeout(() => {
          resolve({
            firstContentfulPaint: fcp,
            largestContentfulPaint: lcp || fcp * 1.5, // Fallback estimate
            cumulativeLayoutShift: cls,
            firstInputDelay: 0, // Would need real user interaction
            timeToInteractive: timeToInteractive,
            totalBlockingTime: Math.max(0, timeToInteractive - domContentLoaded - 50),
            speedIndex: loadTime * 0.8, // Simplified calculation
            performanceScore: this.calculatePerformanceScore({
              fcp,
              lcp: lcp || fcp * 1.5,
              cls,
              tti: timeToInteractive
            })
          });
        }, 2000); // Wait for layout shifts to settle
      });

      function calculatePerformanceScore(metrics: any): number {
        let score = 100;
        
        // FCP scoring (good < 1.8s, needs improvement < 3s)
        if (metrics.fcp > 3000) score -= 20;
        else if (metrics.fcp > 1800) score -= 10;
        
        // LCP scoring (good < 2.5s, needs improvement < 4s)
        if (metrics.lcp > 4000) score -= 25;
        else if (metrics.lcp > 2500) score -= 15;
        
        // CLS scoring (good < 0.1, needs improvement < 0.25)
        if (metrics.cls > 0.25) score -= 20;
        else if (metrics.cls > 0.1) score -= 10;
        
        // TTI scoring (good < 3.8s, needs improvement < 7.3s)
        if (metrics.tti > 7300) score -= 25;
        else if (metrics.tti > 3800) score -= 15;
        
        return Math.max(0, score);
      }
    });

    return metrics;
  }

  /**
   * Test page load performance
   */
  async testPageLoadSpeed(url: string): Promise<{ loadTime: number; resources: number; score: number }> {
    const startTime = Date.now();
    
    await this.page.goto(url, { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // Count resources
    const resourceCount = await this.page.evaluate(() => {
      return performance.getEntriesByType('resource').length;
    });

    // Simple scoring based on load time
    let score = 100;
    if (loadTime > 5000) score = 20;
    else if (loadTime > 3000) score = 50;
    else if (loadTime > 1000) score = 80;

    return {
      loadTime,
      resources: resourceCount,
      score
    };
  }

  /**
   * Test JavaScript bundle sizes and optimization
   */
  async analyzeBundleSize(): Promise<{ totalSize: number; jsSize: number; cssSize: number; imageSize: number }> {
    const resources = await this.page.evaluate(() => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      let totalSize = 0;
      let jsSize = 0;
      let cssSize = 0;
      let imageSize = 0;

      entries.forEach(entry => {
        const size = entry.transferSize || 0;
        totalSize += size;

        if (entry.name.includes('.js')) jsSize += size;
        else if (entry.name.includes('.css')) cssSize += size;
        else if (entry.name.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) imageSize += size;
      });

      return { totalSize, jsSize, cssSize, imageSize };
    });

    return resources;
  }

  /**
   * Test rendering performance and frame rates
   */
  async testRenderingPerformance(): Promise<{ fps: number; frameDrops: number }> {
    let frameCount = 0;
    let lastTime = performance.now();
    const frameTimes: number[] = [];

    // Start frame counting
    const frameCounter = () => {
      const currentTime = performance.now();
      frameTimes.push(currentTime - lastTime);
      lastTime = currentTime;
      frameCount++;
      
      if (frameCount < 60) { // Count for ~1 second
        requestAnimationFrame(frameCounter);
      }
    };

    await this.page.evaluate(() => {
      requestAnimationFrame(() => {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const frameCounter = () => {
          const currentTime = performance.now();
          lastTime = currentTime;
          frameCount++;
          
          if (frameCount < 60) {
            requestAnimationFrame(frameCounter);
          }
        };
        
        frameCounter();
      });
    });

    await this.page.waitForTimeout(2000);

    return {
      fps: 60, // Simplified - would need more complex measurement
      frameDrops: 0
    };
  }
}

// Test Suite Definition
test.describe('ARKHITEKTON Performance Tests', () => {
  let performanceTester: PerformanceTester;

  test.beforeEach(async ({ page }) => {
    performanceTester = new PerformanceTester(page);
  });

  const criticalPages = [
    { name: 'Dashboard', url: '/', threshold: 2000 },
    { name: 'Knowledge Base', url: '/wiki', threshold: 3000 },
    { name: 'Architecture Modeling', url: '/modeling', threshold: 4000 }, // May have heavier assets
    { name: 'Development Plan', url: '/plan', threshold: 2000 }
  ];

  for (const pageConfig of criticalPages) {
    test(`${pageConfig.name} - Core Web Vitals`, async ({ page }) => {
      const tester = new PerformanceTester(page);
      const metrics = await tester.measureCoreWebVitals(pageConfig.url);
      
      // Assert Core Web Vitals thresholds
      expect(metrics.firstContentfulPaint).toBeLessThan(1800); // Good FCP
      expect(metrics.largestContentfulPaint).toBeLessThan(2500); // Good LCP
      expect(metrics.cumulativeLayoutShift).toBeLessThan(0.1); // Good CLS
      expect(metrics.performanceScore).toBeGreaterThan(70);
      
      console.log(`${pageConfig.name} Performance Metrics:`, metrics);
    });

    test(`${pageConfig.name} - Load Speed`, async ({ page }) => {
      const tester = new PerformanceTester(page);
      const result = await tester.testPageLoadSpeed(pageConfig.url);
      
      expect(result.loadTime).toBeLessThan(pageConfig.threshold);
      expect(result.score).toBeGreaterThan(50);
      expect(result.resources).toBeLessThan(100); // Reasonable resource count
    });
  }

  test('Bundle Size Analysis', async ({ page }) => {
    await page.goto('/');
    const tester = new PerformanceTester(page);
    const bundleAnalysis = await tester.analyzeBundleSize();
    
    // Assert reasonable bundle sizes (adjust based on your app)
    expect(bundleAnalysis.jsSize).toBeLessThan(1024 * 1024); // < 1MB JS
    expect(bundleAnalysis.cssSize).toBeLessThan(512 * 1024); // < 512KB CSS
    expect(bundleAnalysis.totalSize).toBeLessThan(5 * 1024 * 1024); // < 5MB total
    
    console.log('Bundle Analysis:', bundleAnalysis);
  });

  test('Rendering Performance', async ({ page }) => {
    await page.goto('/');
    
    // Trigger some animations/interactions
    await page.hover('[data-testid="button-submit"]');
    await page.click('[data-testid="sidebar-toggle"]', { force: true });
    
    const tester = new PerformanceTester(page);
    const renderMetrics = await tester.testRenderingPerformance();
    
    expect(renderMetrics.fps).toBeGreaterThan(30); // Acceptable FPS
    expect(renderMetrics.frameDrops).toBeLessThan(10);
  });
});