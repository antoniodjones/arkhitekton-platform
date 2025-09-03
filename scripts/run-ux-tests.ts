#!/usr/bin/env tsx

/**
 * ARKHITEKTON UX Testing Runner
 * Comprehensive test execution and reporting
 */

import { execSync } from 'child_process';
import { UXTestReporter } from '../tests/ux-framework/reporting';
import fs from 'fs';

interface TestSuite {
  name: string;
  command: string;
  description: string;
  critical: boolean;
}

class UXTestRunner {
  private reporter = new UXTestReporter();
  private testSuites: TestSuite[] = [
    {
      name: 'Visual Regression',
      command: 'npx playwright test tests/ux-framework/visual-regression.ts',
      description: 'Screenshot comparison and visual consistency testing',
      critical: true
    },
    {
      name: 'Accessibility',
      command: 'npx playwright test tests/ux-framework/accessibility.ts', 
      description: 'WCAG 2.1 compliance and screen reader testing',
      critical: true
    },
    {
      name: 'Performance',
      command: 'npx playwright test tests/ux-framework/performance.ts',
      description: 'Core Web Vitals and performance optimization',
      critical: true
    },
    {
      name: 'User Flows',
      command: 'npx playwright test tests/ux-framework/user-flows.ts',
      description: 'End-to-end user journey validation',
      critical: true
    }
  ];

  async runAllTests(): Promise<void> {
    console.log('🏛️  ARKHITEKTON UX Testing Framework');
    console.log('=====================================\n');

    let totalPassed = 0;
    let totalFailed = 0;

    for (const suite of this.testSuites) {
      console.log(`🧪 Running ${suite.name} Tests...`);
      console.log(`   ${suite.description}`);
      
      try {
        const result = await this.runTestSuite(suite);
        
        if (result.success) {
          console.log(`   ✅ ${suite.name}: PASSED`);
          totalPassed++;
        } else {
          console.log(`   ❌ ${suite.name}: FAILED`);
          console.log(`   ${result.error}`);
          totalFailed++;
        }
      } catch (error) {
        console.log(`   💥 ${suite.name}: ERROR`);
        console.log(`   ${error}`);
        totalFailed++;
      }
      
      console.log('');
    }

    // Generate comprehensive report
    await this.generateReport();
    
    // Summary
    console.log('📊 Test Summary');
    console.log('================');
    console.log(`Total Suites: ${this.testSuites.length}`);
    console.log(`Passed: ${totalPassed}`);
    console.log(`Failed: ${totalFailed}`);
    console.log(`Success Rate: ${Math.round((totalPassed / this.testSuites.length) * 100)}%`);
    
    if (totalFailed > 0) {
      console.log('\n⚠️  Some tests failed. Check the detailed report for recommendations.');
      process.exit(1);
    } else {
      console.log('\n🎉 All UX tests passed! ARKHITEKTON is ready for deployment.');
    }
  }

  private async runTestSuite(suite: TestSuite): Promise<{ success: boolean; error?: string }> {
    try {
      execSync(suite.command, { 
        stdio: 'pipe',
        timeout: 300000 // 5 minutes timeout
      });
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Unknown error' 
      };
    }
  }

  private async generateReport(): Promise<void> {
    console.log('📝 Generating comprehensive UX report...');
    
    // Load test results from Playwright JSON output
    const resultsPath = 'test-results/results.json';
    
    if (fs.existsSync(resultsPath)) {
      try {
        const rawResults = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
        
        // Process Playwright results into our format
        // This is simplified - you'd need to parse the actual Playwright JSON format
        
        const report = this.reporter.generateReport();
        const reportPath = await this.reporter.saveReport(report);
        
        console.log(`📄 Report generated: ${reportPath}`);
        console.log(`🎯 Overall Score: ${report.summary.overallScore}%`);
        
        if (report.recommendations.length > 0) {
          console.log('\n💡 Key Recommendations:');
          report.recommendations.slice(0, 3).forEach(rec => {
            console.log(`   ${rec}`);
          });
        }
      } catch (error) {
        console.log('⚠️  Could not generate detailed report:', error);
      }
    }
  }

  async runSpecificSuite(suiteName: string): Promise<void> {
    const suite = this.testSuites.find(s => 
      s.name.toLowerCase().includes(suiteName.toLowerCase())
    );
    
    if (!suite) {
      console.log(`❌ Test suite "${suiteName}" not found.`);
      console.log('Available suites:', this.testSuites.map(s => s.name).join(', '));
      return;
    }

    console.log(`🧪 Running ${suite.name} Tests Only...`);
    const result = await this.runTestSuite(suite);
    
    if (result.success) {
      console.log(`✅ ${suite.name}: PASSED`);
    } else {
      console.log(`❌ ${suite.name}: FAILED`);
      console.log(result.error);
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const runner = new UXTestRunner();

  if (args.length === 0) {
    // Run all tests
    await runner.runAllTests();
  } else if (args[0] === '--suite' && args[1]) {
    // Run specific suite
    await runner.runSpecificSuite(args[1]);
  } else {
    console.log('🏛️  ARKHITEKTON UX Testing Framework');
    console.log('Usage:');
    console.log('  npm run test:ux                    # Run all UX tests');
    console.log('  npm run test:ux --suite visual     # Run specific test suite');
    console.log('');
    console.log('Available test suites:');
    console.log('  visual       - Visual regression tests');
    console.log('  accessibility - WCAG compliance tests');
    console.log('  performance  - Performance and Core Web Vitals');
    console.log('  flows        - User journey tests');
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  });
}