import fs from 'fs';
import path from 'path';
import { TestReport, UXTestResult } from './types';

/**
 * ARKHITEKTON UX Test Reporting System
 * Comprehensive test result aggregation and analysis
 */

export class UXTestReporter {
  private results: UXTestResult[] = [];
  private reportDir = 'test-results/ux-reports';

  constructor() {
    // Ensure report directory exists
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }
  }

  /**
   * Add test result to collection
   */
  addResult(result: UXTestResult): void {
    this.results.push(result);
  }

  /**
   * Generate comprehensive UX test report
   */
  generateReport(): TestReport {
    const summary = this.calculateSummary();
    const recommendations = this.generateRecommendations();

    const report: TestReport = {
      summary,
      results: this.results,
      recommendations,
      generatedAt: new Date().toISOString()
    };

    return report;
  }

  /**
   * Calculate test summary statistics
   */
  private calculateSummary() {
    const totalTests = this.results.length;
    let passed = 0;
    let totalScore = 0;

    this.results.forEach(result => {
      let resultPassed = true;
      let resultScore = 0;

      // Visual test scoring
      if (result.visual) {
        resultPassed = resultPassed && result.visual.passed;
        resultScore += result.visual.passed ? 25 : 0;
      }

      // Accessibility test scoring
      if (result.accessibility) {
        const accessibilityPassed = result.accessibility.score > 80;
        resultPassed = resultPassed && accessibilityPassed;
        resultScore += (result.accessibility.score / 100) * 25;
      }

      // Performance test scoring
      if (result.performance) {
        const performancePassed = result.performance.performanceScore > 70;
        resultPassed = resultPassed && performancePassed;
        resultScore += (result.performance.performanceScore / 100) * 25;
      }

      // User flow scoring
      if (result.userFlow) {
        resultPassed = resultPassed && result.userFlow.passed;
        resultScore += result.userFlow.passed ? 25 : 0;
      }

      if (resultPassed) passed++;
      totalScore += resultScore;
    });

    return {
      totalTests,
      passed,
      failed: totalTests - passed,
      overallScore: totalTests > 0 ? Math.round(totalScore / totalTests) : 0
    };
  }

  /**
   * Generate actionable recommendations based on test results
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const issues = this.analyzeIssues();

    if (issues.visualRegressions > 0) {
      recommendations.push(`🎨 Fix ${issues.visualRegressions} visual regression(s) detected across different viewports`);
    }

    if (issues.accessibilityViolations > 0) {
      recommendations.push(`♿ Address ${issues.accessibilityViolations} accessibility violation(s) for WCAG compliance`);
    }

    if (issues.performanceIssues > 0) {
      recommendations.push(`⚡ Optimize performance - ${issues.performanceIssues} page(s) below acceptable thresholds`);
    }

    if (issues.userFlowFailures > 0) {
      recommendations.push(`🚦 Fix ${issues.userFlowFailures} user flow failure(s) affecting core functionality`);
    }

    // Specific recommendations based on patterns
    const slowPages = this.results.filter(r => 
      r.performance && r.performance.largestContentfulPaint > 2500
    );
    if (slowPages.length > 0) {
      recommendations.push(`🐌 Improve loading performance for: ${slowPages.map(r => r.testSuite).join(', ')}`);
    }

    const contrastIssues = this.results.filter(r =>
      r.accessibility && r.accessibility.violations.some(v => v.id === 'color-contrast')
    );
    if (contrastIssues.length > 0) {
      recommendations.push(`🎨 Improve color contrast ratios for better accessibility`);
    }

    const mobileIssues = this.results.filter(r =>
      r.viewport.name.includes('mobile') && 
      (r.visual?.passed === false || (r.performance?.performanceScore || 0) < 60)
    );
    if (mobileIssues.length > 0) {
      recommendations.push(`📱 Optimize mobile experience - performance and visual issues detected`);
    }

    return recommendations;
  }

  /**
   * Analyze common issue patterns
   */
  private analyzeIssues() {
    let visualRegressions = 0;
    let accessibilityViolations = 0;
    let performanceIssues = 0;
    let userFlowFailures = 0;

    this.results.forEach(result => {
      if (result.visual && !result.visual.passed) visualRegressions++;
      
      if (result.accessibility && result.accessibility.violations_count > 0) {
        accessibilityViolations += result.accessibility.violations_count;
      }
      
      if (result.performance && result.performance.performanceScore < 70) performanceIssues++;
      
      if (result.userFlow && !result.userFlow.passed) userFlowFailures++;
    });

    return {
      visualRegressions,
      accessibilityViolations,
      performanceIssues,
      userFlowFailures
    };
  }

  /**
   * Save report to file system
   */
  async saveReport(report: TestReport): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `ux-test-report-${timestamp}.json`;
    const filepath = path.join(this.reportDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));

    // Also generate HTML report
    const htmlReport = this.generateHTMLReport(report);
    const htmlFilename = `ux-test-report-${timestamp}.html`;
    const htmlFilepath = path.join(this.reportDir, htmlFilename);
    
    fs.writeFileSync(htmlFilepath, htmlReport);

    return htmlFilepath;
  }

  /**
   * Generate HTML report for better readability
   */
  private generateHTMLReport(report: TestReport): string {
    const { summary, recommendations } = report;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ARKHITEKTON UX Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #ea580c, #f97316); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 2.5em; font-weight: 700; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 30px; }
        .metric { background: #f8fafc; border-radius: 8px; padding: 20px; text-align: center; border: 2px solid #e2e8f0; }
        .metric.good { border-color: #10b981; background: #ecfdf5; }
        .metric.warning { border-color: #f59e0b; background: #fffbeb; }
        .metric.error { border-color: #ef4444; background: #fef2f2; }
        .metric-value { font-size: 2.5em; font-weight: bold; margin-bottom: 5px; }
        .metric-label { font-size: 0.9em; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
        .recommendations { padding: 30px; border-top: 1px solid #e2e8f0; }
        .recommendation { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin-bottom: 10px; }
        .results-grid { padding: 30px; }
        .result-card { border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 15px; padding: 20px; }
        .result-header { font-weight: 600; margin-bottom: 10px; }
        .result-details { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; font-size: 0.9em; }
        .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 0.8em; font-weight: 500; }
        .badge.success { background: #dcfce7; color: #166534; }
        .badge.error { background: #fee2e2; color: #991b1b; }
        .footer { text-align: center; padding: 20px; color: #6b7280; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏛️ ARKHITEKTON</h1>
            <p>UX Testing Report - Generated ${new Date(report.generatedAt).toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <div class="metric ${summary.overallScore >= 80 ? 'good' : summary.overallScore >= 60 ? 'warning' : 'error'}">
                <div class="metric-value">${summary.overallScore}%</div>
                <div class="metric-label">Overall Score</div>
            </div>
            <div class="metric ${summary.failed === 0 ? 'good' : 'error'}">
                <div class="metric-value">${summary.passed}/${summary.totalTests}</div>
                <div class="metric-label">Tests Passed</div>
            </div>
            <div class="metric ${summary.failed === 0 ? 'good' : 'error'}">
                <div class="metric-value">${summary.failed}</div>
                <div class="metric-label">Failed Tests</div>
            </div>
        </div>

        ${recommendations.length > 0 ? `
        <div class="recommendations">
            <h2>🎯 Recommendations</h2>
            ${recommendations.map(rec => `<div class="recommendation">${rec}</div>`).join('')}
        </div>
        ` : ''}

        <div class="results-grid">
            <h2>📊 Detailed Results</h2>
            ${report.results.map(result => `
                <div class="result-card">
                    <div class="result-header">
                        ${result.testSuite} - ${result.viewport.name} 
                        <span class="badge ${this.getOverallResultStatus(result)}">
                            ${this.getOverallResultStatus(result).toUpperCase()}
                        </span>
                    </div>
                    <div class="result-details">
                        ${result.visual ? `<div>Visual: <span class="badge ${result.visual.passed ? 'success' : 'error'}">${result.visual.passed ? 'PASS' : 'FAIL'}</span></div>` : ''}
                        ${result.accessibility ? `<div>Accessibility: <span class="badge ${result.accessibility.score > 80 ? 'success' : 'error'}">${result.accessibility.score}%</span></div>` : ''}
                        ${result.performance ? `<div>Performance: <span class="badge ${result.performance.performanceScore > 70 ? 'success' : 'error'}">${result.performance.performanceScore}%</span></div>` : ''}
                        ${result.userFlow ? `<div>User Flow: <span class="badge ${result.userFlow.passed ? 'success' : 'error'}">${result.userFlow.passed ? 'PASS' : 'FAIL'}</span></div>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="footer">
            <p>Generated by ARKHITEKTON UX Testing Framework</p>
        </div>
    </div>
</body>
</html>`;
  }

  private getOverallResultStatus(result: UXTestResult): 'success' | 'error' {
    let allPassed = true;
    
    if (result.visual && !result.visual.passed) allPassed = false;
    if (result.accessibility && result.accessibility.score <= 80) allPassed = false;
    if (result.performance && result.performance.performanceScore <= 70) allPassed = false;
    if (result.userFlow && !result.userFlow.passed) allPassed = false;
    
    return allPassed ? 'success' : 'error';
  }

  /**
   * Generate summary dashboard data
   */
  generateDashboardData() {
    const report = this.generateReport();
    
    return {
      overall_score: report.summary.overallScore,
      total_tests: report.summary.totalTests,
      passed_tests: report.summary.passed,
      failed_tests: report.summary.failed,
      recommendations_count: report.recommendations.length,
      last_updated: report.generatedAt,
      trend_data: this.calculateTrend() // Could track improvement over time
    };
  }

  private calculateTrend() {
    // Simplified trend calculation - in practice, you'd store historical data
    return {
      score_change: 0,
      period: 'week'
    };
  }
}