/**
 * ARKHITEKTON UX Testing Framework Integration
 * Main entry point that coordinates all testing suites
 */

import { test, expect } from '@playwright/test';
import { VisualRegressionTester } from './visual-regression';
import { AccessibilityTester } from './accessibility';
import { PerformanceTester } from './performance';
import { UserFlowTester } from './user-flows';
import { UXTestReporter } from './reporting';
import { UX_TEST_CONFIG, getTestConfig } from './config';

/**
 * Integrated UX Testing Suite
 * Runs comprehensive tests across all categories
 */
test.describe('ARKHITEKTON - Comprehensive UX Testing Suite', () => {
  let reporter: UXTestReporter;

  test.beforeAll(async () => {
    reporter = new UXTestReporter();
    console.log('🏛️  Starting ARKHITEKTON UX Testing Framework');
    console.log(`📊 Testing ${UX_TEST_CONFIG.CRITICAL_PAGES.length} critical pages`);
    console.log(`📱 Across ${Object.keys(UX_TEST_CONFIG.VIEWPORTS).length} viewport sizes`);
  });

  test.afterAll(async () => {
    // Generate comprehensive report
    const report = reporter.generateReport();
    const reportPath = await reporter.saveReport(report);
    
    console.log('\n📋 UX Testing Summary');
    console.log('=====================');
    console.log(`Overall Score: ${report.summary.overallScore}%`);
    console.log(`Tests Passed: ${report.summary.passed}/${report.summary.totalTests}`);
    console.log(`Report Generated: ${reportPath}`);
    
    if (report.recommendations.length > 0) {
      console.log('\n💡 Top Recommendations:');
      report.recommendations.slice(0, 5).forEach((rec, i) => {
        console.log(`   ${i + 1}. ${rec}`);
      });
    }
  });

  // Comprehensive page testing
  for (const pageConfig of UX_TEST_CONFIG.CRITICAL_PAGES) {
    test(`Complete UX Audit: ${pageConfig.name}`, async ({ page }) => {
      console.log(`\n🧪 Testing ${pageConfig.name} (${pageConfig.path})...`);
      
      // Initialize all testers
      const visualTester = new VisualRegressionTester(page);
      const accessibilityTester = new AccessibilityTester(page);
      const performanceTester = new PerformanceTester(page);
      
      const testResults: any[] = [];
      
      try {
        // 1. Performance Testing (first to get clean measurements)
        console.log('   ⚡ Performance testing...');
        const performanceMetrics = await performanceTester.measureCoreWebVitals(pageConfig.path);
        
        testResults.push({
          timestamp: new Date().toISOString(),
          testSuite: `${pageConfig.name.toLowerCase()}-performance`,
          viewport: UX_TEST_CONFIG.VIEWPORTS.DESKTOP,
          performance: performanceMetrics
        });

        // Validate performance thresholds
        expect(performanceMetrics.firstContentfulPaint).toBeLessThan(UX_TEST_CONFIG.PERFORMANCE_THRESHOLDS.FIRST_CONTENTFUL_PAINT);
        expect(performanceMetrics.largestContentfulPaint).toBeLessThan(UX_TEST_CONFIG.PERFORMANCE_THRESHOLDS.LARGEST_CONTENTFUL_PAINT);
        expect(performanceMetrics.cumulativeLayoutShift).toBeLessThan(UX_TEST_CONFIG.PERFORMANCE_THRESHOLDS.CUMULATIVE_LAYOUT_SHIFT);

        // 2. Accessibility Testing
        console.log('   ♿ Accessibility testing...');
        const accessibilityResult = await accessibilityTester.auditAccessibility(pageConfig.path);
        
        testResults.push({
          timestamp: new Date().toISOString(),
          testSuite: `${pageConfig.name.toLowerCase()}-accessibility`,
          viewport: UX_TEST_CONFIG.VIEWPORTS.DESKTOP,
          accessibility: accessibilityResult
        });

        // Validate accessibility thresholds
        expect(accessibilityResult.score).toBeGreaterThan(UX_TEST_CONFIG.ACCESSIBILITY_THRESHOLDS.MIN_SCORE);
        expect(accessibilityResult.violations_count).toBeLessThan(UX_TEST_CONFIG.ACCESSIBILITY_THRESHOLDS.MAX_VIOLATIONS);

        // 3. Visual Testing (desktop)
        console.log('   🎨 Visual regression testing...');
        const visualPassed = await visualTester.testPageVisuals(
          pageConfig.name.toLowerCase(),
          pageConfig.path,
          UX_TEST_CONFIG.VIEWPORTS.DESKTOP
        );

        testResults.push({
          timestamp: new Date().toISOString(),
          testSuite: `${pageConfig.name.toLowerCase()}-visual`,
          viewport: UX_TEST_CONFIG.VIEWPORTS.DESKTOP,
          visual: { passed: visualPassed, differences: 0, threshold: UX_TEST_CONFIG.VISUAL_THRESHOLD }
        });

        // 4. Responsive Testing
        console.log('   📱 Responsive design testing...');
        const responsiveResults = await visualTester.testResponsiveDesign(pageConfig.path);
        testResults.push(...responsiveResults);

        // Add all results to reporter
        testResults.forEach(result => reporter.addResult(result));

        console.log(`   ✅ ${pageConfig.name} testing completed successfully`);

      } catch (error) {
        console.log(`   ❌ ${pageConfig.name} testing failed:`, error);
        
        // Add failed result
        reporter.addResult({
          timestamp: new Date().toISOString(),
          testSuite: `${pageConfig.name.toLowerCase()}-failed`,
          viewport: UX_TEST_CONFIG.VIEWPORTS.DESKTOP,
          visual: { passed: false, differences: -1, threshold: UX_TEST_CONFIG.VISUAL_THRESHOLD }
        });
        
        // Re-throw to fail the test
        throw error;
      }
    });
  }

  // Cross-browser compatibility testing
  test('Cross-Browser Compatibility', async ({ page, browserName }) => {
    console.log(`\n🌐 Testing cross-browser compatibility on ${browserName}...`);
    
    // Test critical page on different browsers
    const criticalPage = UX_TEST_CONFIG.CRITICAL_PAGES[0]; // Dashboard
    
    const visualTester = new VisualRegressionTester(page);
    const result = await visualTester.testPageVisuals(
      `${criticalPage.name.toLowerCase()}-${browserName}`,
      criticalPage.path,
      UX_TEST_CONFIG.VIEWPORTS.DESKTOP
    );

    expect(result).toBe(true);
    
    reporter.addResult({
      timestamp: new Date().toISOString(),
      testSuite: `cross-browser-${browserName}`,
      viewport: UX_TEST_CONFIG.VIEWPORTS.DESKTOP,
      visual: { passed: result, differences: 0, threshold: UX_TEST_CONFIG.VISUAL_THRESHOLD }
    });
  });

  // Bundle size and optimization testing
  test('Bundle Size and Resource Optimization', async ({ page }) => {
    console.log('\n📦 Testing bundle sizes and resource optimization...');
    
    await page.goto('/');
    const performanceTester = new PerformanceTester(page);
    const bundleAnalysis = await performanceTester.analyzeBundleSize();
    
    // Validate bundle size limits
    expect(bundleAnalysis.jsSize).toBeLessThan(UX_TEST_CONFIG.BUNDLE_SIZE_LIMITS.TOTAL_JS);
    expect(bundleAnalysis.cssSize).toBeLessThan(UX_TEST_CONFIG.BUNDLE_SIZE_LIMITS.TOTAL_CSS);
    expect(bundleAnalysis.totalSize).toBeLessThan(UX_TEST_CONFIG.BUNDLE_SIZE_LIMITS.TOTAL_ASSETS);
    
    console.log('   📊 Bundle Analysis:', {
      totalJS: `${Math.round(bundleAnalysis.jsSize / 1024)}KB`,
      totalCSS: `${Math.round(bundleAnalysis.cssSize / 1024)}KB`,
      totalSize: `${Math.round(bundleAnalysis.totalSize / 1024)}KB`
    });
  });

  // Component library consistency testing
  test('Component Library Consistency', async ({ page }) => {
    console.log('\n🧩 Testing component library consistency...');
    
    await page.goto('/');
    const visualTester = new VisualRegressionTester(page);
    await visualTester.testComponentLibrary();
    
    console.log('   ✅ Component consistency validated');
  });
});