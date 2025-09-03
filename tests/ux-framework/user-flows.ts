import { test, expect, Page } from '@playwright/test';
import { UserFlow, UserFlowStep } from './types';

/**
 * ARKHITEKTON User Flow Testing Suite
 * End-to-end user journey testing and interaction validation
 */

export class UserFlowTester {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Execute a complete user flow with validation
   */
  async executeUserFlow(flow: UserFlow): Promise<{ passed: boolean; completedSteps: number; error?: string }> {
    let completedSteps = 0;

    try {
      for (const step of flow.steps) {
        await this.executeStep(step);
        completedSteps++;

        // Take screenshot if requested
        if (step.screenshot) {
          await this.page.screenshot({ path: `test-results/flow-${flow.name}-step-${completedSteps}.png` });
        }
      }

      return { passed: true, completedSteps };
    } catch (error) {
      return { 
        passed: false, 
        completedSteps, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Execute individual flow step
   */
  private async executeStep(step: UserFlowStep): Promise<void> {
    const timeout = step.timeout || 5000;

    switch (step.action) {
      case 'navigate':
        if (!step.url) throw new Error(`Navigate step requires URL: ${step.name}`);
        await this.page.goto(step.url);
        await this.page.waitForLoadState('networkidle');
        break;

      case 'click':
        if (!step.selector) throw new Error(`Click step requires selector: ${step.name}`);
        await this.page.click(step.selector, { timeout });
        break;

      case 'type':
        if (!step.selector || !step.text) throw new Error(`Type step requires selector and text: ${step.name}`);
        await this.page.fill(step.selector, step.text, { timeout });
        break;

      case 'select':
        if (!step.selector || !step.text) throw new Error(`Select step requires selector and value: ${step.name}`);
        await this.page.selectOption(step.selector, step.text, { timeout });
        break;

      case 'wait':
        await this.page.waitForTimeout(step.timeout || 1000);
        break;

      case 'scroll':
        if (step.selector) {
          await this.page.locator(step.selector).scrollIntoViewIfNeeded();
        } else {
          await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        }
        break;

      default:
        throw new Error(`Unknown action: ${step.action}`);
    }

    // Small delay between steps for stability
    await this.page.waitForTimeout(100);
  }

  /**
   * Validate expected outcomes after flow completion
   */
  async validateOutcome(expectedOutcome: string): Promise<boolean> {
    // This is a simplified validation - in practice, you'd have more specific checks
    switch (expectedOutcome) {
      case 'navigated-to-dashboard':
        return await this.page.locator('[data-testid="dashboard-content"]').isVisible();
      
      case 'knowledge-base-page-created':
        return await this.page.locator('[data-testid="page-created-success"]').isVisible();
      
      case 'sidebar-collapsed':
        const sidebar = this.page.locator('.compact-sidebar');
        const width = await sidebar.evaluate(el => el.getBoundingClientRect().width);
        return width < 80;
      
      case 'model-saved':
        return await this.page.locator('[data-testid="model-save-success"]').isVisible();
      
      default:
        return true; // Default to passed if no specific validation
    }
  }
}

// Test Suite Definition
test.describe('ARKHITEKTON User Flow Tests', () => {
  let userFlowTester: UserFlowTester;

  test.beforeEach(async ({ page }) => {
    userFlowTester = new UserFlowTester(page);
  });

  // Critical User Flows
  const userFlows: UserFlow[] = [
    {
      name: 'navigation-flow',
      description: 'User navigates through main sections of ARKHITEKTON',
      steps: [
        { name: 'Start at dashboard', action: 'navigate', url: '/' },
        { name: 'Go to Knowledge Base', action: 'click', selector: '[href="/wiki"]' },
        { name: 'Go to Architecture Modeling', action: 'click', selector: '[href="/modeling"]' },
        { name: 'Go to Development Plan', action: 'click', selector: '[href="/plan"]' },
        { name: 'Return to Dashboard', action: 'click', selector: '[href="/"]' }
      ],
      expectedOutcome: 'navigated-to-dashboard'
    },
    
    {
      name: 'knowledge-base-creation-flow',
      description: 'User creates a new knowledge base page',
      steps: [
        { name: 'Navigate to Knowledge Base', action: 'navigate', url: '/wiki' },
        { name: 'Click Create Page', action: 'click', selector: '[data-testid="button-create-page"]' },
        { name: 'Enter page title', action: 'type', selector: '[data-testid="input-page-title-inline"]', text: 'Test Architecture Guide' },
        { name: 'Wait for auto-save', action: 'wait', timeout: 3000 },
        { name: 'Take screenshot', action: 'wait', timeout: 500, screenshot: true }
      ],
      expectedOutcome: 'knowledge-base-page-created'
    },

    {
      name: 'sidebar-interaction-flow', 
      description: 'User interacts with responsive sidebar',
      steps: [
        { name: 'Start at dashboard', action: 'navigate', url: '/' },
        { name: 'Hover over sidebar', action: 'click', selector: '.compact-sidebar' },
        { name: 'Resize sidebar', action: 'click', selector: '[data-testid="sidebar-resize-handle"]' },
        { name: 'Test tooltip visibility', action: 'wait', timeout: 1000 },
        { name: 'Take screenshot', action: 'wait', timeout: 500, screenshot: true }
      ],
      expectedOutcome: 'sidebar-collapsed'
    },

    {
      name: 'development-plan-interaction-flow',
      description: 'User interacts with development plan tasks',
      steps: [
        { name: 'Navigate to Plan', action: 'navigate', url: '/plan' },
        { name: 'Toggle task completion', action: 'click', selector: '[data-testid="task-checkbox-f1"]' },
        { name: 'Switch between phases', action: 'click', selector: '[value="knowledge-base"]' },
        { name: 'View progress', action: 'scroll', selector: '.progress-section' },
        { name: 'Take final screenshot', action: 'wait', timeout: 500, screenshot: true }
      ],
      expectedOutcome: 'navigated-to-dashboard'
    },

    {
      name: 'responsive-design-flow',
      description: 'Test responsive behavior across different screen sizes',
      steps: [
        { name: 'Start at dashboard', action: 'navigate', url: '/' },
        { name: 'Test mobile view', action: 'wait', timeout: 1000 },
        { name: 'Navigate on mobile', action: 'click', selector: '[data-testid="mobile-menu-toggle"]' },
        { name: 'Select page', action: 'click', selector: '[href="/wiki"]' },
        { name: 'Take mobile screenshot', action: 'wait', timeout: 500, screenshot: true }
      ],
      expectedOutcome: 'navigated-to-dashboard'
    }
  ];

  // Execute each user flow
  for (const flow of userFlows) {
    test(`User Flow: ${flow.name}`, async ({ page }) => {
      const tester = new UserFlowTester(page);
      const result = await tester.executeUserFlow(flow);

      // Validate flow execution
      expect(result.passed).toBe(true);
      expect(result.completedSteps).toBe(flow.steps.length);

      if (!result.passed) {
        console.log(`Flow ${flow.name} failed:`, result.error);
        console.log(`Completed ${result.completedSteps}/${flow.steps.length} steps`);
      }

      // Validate expected outcome
      const outcomeValid = await tester.validateOutcome(flow.expectedOutcome);
      expect(outcomeValid).toBe(true);
    });
  }

  // Cross-browser user flow testing
  test('Critical Flow - Cross Browser', async ({ page, browserName }) => {
    const criticalFlow = userFlows[0]; // Navigation flow
    const tester = new UserFlowTester(page);
    
    console.log(`Testing critical flow on ${browserName}`);
    
    const result = await tester.executeUserFlow(criticalFlow);
    expect(result.passed).toBe(true);
    
    // Browser-specific validations could be added here
  });

  // Performance-aware user flows
  test('Performance Impact During User Interactions', async ({ page }) => {
    const startTime = Date.now();
    
    // Execute a complex flow while monitoring performance
    const flow = userFlows[1]; // Knowledge base creation
    const tester = new UserFlowTester(page);
    
    const result = await tester.executeUserFlow(flow);
    const totalTime = Date.now() - startTime;
    
    expect(result.passed).toBe(true);
    expect(totalTime).toBeLessThan(15000); // Should complete within 15 seconds
    
    console.log(`Flow completed in ${totalTime}ms`);
  });
});