import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import * as schema from '../shared/schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function fixAgentStories() {
  console.log('🔧 Fixing Multi-Agent AI System stories...\n');

  // 1. Delete the conflicting Product Owner development story
  console.log('🗑️  Removing US-AI-AGENT-003 (role conflict)...');
  await db.delete(schema.userStories).where(eq(schema.userStories.id, 'US-AI-AGENT-003'));
  console.log('✅ Removed conflicting story\n');

  // 2. Update Product Owner story to focus on product duties
  console.log('📝 Updating US-AI-AGENT-002 with better Gherkin...');
  await db.update(schema.userStories)
    .set({
      title: 'Product Owner Agent - Story Refinement and Requirements',
      description: 'As a Product Owner Agent, I want to refine user stories and manage requirements so that the development team has clear, actionable work items.',
      acceptanceCriteria: `Scenario: Create new user story from business requirements
Given I am a Product Owner Agent with business requirements
When I create a new user story
Then the story should follow INVEST criteria
And the story should have a unique ID
And the story should be assigned to the appropriate epic
And the story should include priority and estimated points

Scenario: Generate Gherkin acceptance criteria
Given I have a user story with requirements
When I generate acceptance criteria
Then the criteria should use proper Gherkin format (Given/When/Then)
And each scenario should be independently testable
And edge cases should be included

Scenario: Refine existing stories based on feedback
Given I receive feedback on a user story
When I refine the story
Then unclear requirements should be clarified
And acceptance criteria should be updated
And the story should remain independently deliverable`
    })
    .where(eq(schema.userStories.id, 'US-AI-AGENT-002'));
  console.log('✅ Updated Product Owner story\n');

  // 3. Update UAT story with better Gherkin
  console.log('📝 Updating US-AI-AGENT-004 with better Gherkin...');
  await db.update(schema.userStories)
    .set({
      acceptanceCriteria: `Scenario: Execute UAT test scenarios
Given I am a Product Owner Agent performing UAT
And a feature is marked for UAT checkout
When I execute UAT test scenarios based on acceptance criteria
Then all Given/When/Then scenarios should be validated
And I should document UAT results

Scenario: Collaborate with user for validation
Given I am performing UAT with the user
When the user validates functionality
Then I should capture user feedback
And I should document any discrepancies

Scenario: Accept feature completion
Given UAT validation is complete
And all acceptance criteria are met
When I accept the feature
Then the story should be marked "UAT Passed"
And the feature should be ready for business release

Scenario: Create defects for unmet requirements
Given UAT validation reveals issues
When requirements are not met
Then I should create defects with appropriate severity
And the story should be marked "UAT Failed"
And the story should be blocked until defects are resolved`
    })
    .where(eq(schema.userStories.id, 'US-AI-AGENT-004'));
  console.log('✅ Updated UAT Checkout story\n');

  // 4. Add Developer Agent stories
  const developerStories = [
    {
      id: 'US-AI-AGENT-013',
      title: 'Developer Agent - Feature Implementation',
      description: 'As a Developer Agent, I want to implement features based on user stories and acceptance criteria so that business requirements are delivered as working software.',
      acceptanceCriteria: `Scenario: Implement feature from user story
Given I am a Developer Agent with an approved user story
And the story has valid Gherkin acceptance criteria
When I implement the feature
Then the code should satisfy all acceptance criteria scenarios
And the code should follow project coding standards
And the implementation should be tested

Scenario: Link code to user stories
Given I am implementing a feature
When I commit code changes
Then each commit should reference the user story ID
And the commit message should describe what was implemented
And the code should be traceable to acceptance criteria

Scenario: Handle implementation blockers
Given I encounter a blocker during implementation
When the blocker prevents progress
Then I should document the blocker
And I should notify the Product Owner Agent
And I should update the story status to "blocked"`,
      epicId: 'EPIC-5',
      status: 'backlog',
      priority: 'high',
      storyPoints: 13,
      labels: ['ai-agents', 'developer', 'implementation', 'core']
    },
    {
      id: 'US-AI-AGENT-014',
      title: 'Developer Agent - CI/CD Integration',
      description: 'As a Developer Agent, I want to integrate with CI/CD pipelines so that code changes are automatically built, tested, and deployed.',
      acceptanceCriteria: `Scenario: Trigger CI/CD on code commit
Given I have implemented a feature
When I commit and push code changes
Then the CI/CD pipeline should be triggered automatically
And automated tests should run
And build status should be reported

Scenario: Handle build failures
Given the CI/CD pipeline fails
When I receive the failure notification
Then I should analyze the failure reason
And I should fix the issue
And I should re-trigger the pipeline

Scenario: Deploy to environment
Given all tests pass in the pipeline
When the build is successful
Then the code should be deployed to the target environment
And the deployment status should be updated
And the user story should reflect the deployment`,
      epicId: 'EPIC-5',
      status: 'backlog',
      priority: 'high',
      storyPoints: 8,
      labels: ['ai-agents', 'developer', 'ci-cd', 'automation']
    },
    {
      id: 'US-AI-AGENT-015',
      title: 'Developer Agent - Code Review and Quality',
      description: 'As a Developer Agent, I want to ensure code quality through automated reviews so that technical debt is minimized and standards are maintained.',
      acceptanceCriteria: `Scenario: Perform automated code review
Given I have implemented a feature
When I request code review
Then the Architect Agent should review the code
And code quality metrics should be analyzed
And security vulnerabilities should be scanned

Scenario: Address review feedback
Given I receive code review feedback
When the Architect Agent suggests improvements
Then I should implement the recommended changes
And I should request re-review
And the story should not complete until review passes

Scenario: Validate test coverage
Given I have implemented a feature
When I check test coverage
Then unit test coverage should meet minimum threshold
And integration tests should cover critical paths
And the QA Agent should validate test completeness`,
      epicId: 'EPIC-5',
      status: 'backlog',
      priority: 'medium',
      storyPoints: 8,
      labels: ['ai-agents', 'developer', 'code-quality', 'review']
    }
  ];

  console.log('➕ Adding Developer Agent stories...\n');
  for (const story of developerStories) {
    await db.insert(schema.userStories).values({
      id: story.id,
      title: story.title,
      description: story.description,
      acceptanceCriteria: story.acceptanceCriteria,
      epicId: story.epicId,
      status: story.status,
      priority: story.priority,
      storyPoints: story.storyPoints,
      labels: story.labels,
      assignedTo: null,
      reviewedBy: null,
      blockedBy: null,
      blockingReason: null,
      sprintId: null,
      estimatedHours: null,
      actualHours: null,
      dueDate: null,
      completedDate: null,
      githubIssue: null,
      githubPR: null,
      tags: story.labels,
      customFields: {},
    });
    console.log(`✅ Created: ${story.id} - ${story.title}`);
  }

  console.log('\n✨ Agent stories fixed successfully!');
  console.log('\n📊 Final Summary:');
  console.log('- Total stories: 14 (removed 1, added 3)');
  console.log('- Epic: EPIC-5 (Operations & Intelligence)');
  console.log('- Product Owner Agent: Story refinement + UAT (no development)');
  console.log('- Developer Agent: Implementation + CI/CD + Code Quality');
  console.log('- QA Agent: Test generation + Defect management + Quality gates');
  console.log('- Architect Agent: Multi-agent collaboration');
  console.log('- All acceptance criteria: Discrete Gherkin scenarios ✅');
}

fixAgentStories().catch(console.error);
