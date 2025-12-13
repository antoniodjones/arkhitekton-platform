import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import * as schema from '../shared/schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

const gherkinUpdates = [
  {
    id: 'US-AI-AGENT-001',
    acceptanceCriteria: `Scenario: Define agent types and capabilities
Given I am designing the agent system architecture
When I define agent types (Product Owner, QA, Developer, Architect)
Then each agent type should have clearly defined capabilities
And each agent should have specific permissions
And agent roles should not overlap in responsibilities

Scenario: Implement agent state tracking
Given an agent is performing tasks
When the agent changes state
Then the system should track agent status (idle, working, waiting)
And the system should log agent activities with timestamps
And the system should capture agent decisions and reasoning

Scenario: Enable agent-to-agent communication
Given multiple agents are working on a project
When one agent needs to communicate with another
Then the system should support agent-to-agent messaging
And messages should follow defined communication protocols
And communication history should be auditable`
  },
  {
    id: 'US-AI-AGENT-005',
    acceptanceCriteria: `Scenario: Parse Gherkin acceptance criteria
Given I am a QA Agent analyzing a user story
And the story has Gherkin acceptance criteria
When I parse the Given/When/Then scenarios
Then I should extract all scenarios automatically
And I should identify test data requirements
And I should validate scenario completeness

Scenario: Generate test cases from scenarios
Given I have parsed Gherkin scenarios
When I generate test cases
Then each scenario should produce a corresponding test case
And test steps should map to Given/When/Then statements
And expected results should be clearly defined

Scenario: Identify edge cases and negative scenarios
Given I have generated basic test cases
When I analyze for edge cases
Then I should suggest boundary value tests
And I should identify negative test scenarios
And I should recommend error handling tests`
  },
  {
    id: 'US-AI-AGENT-006',
    acceptanceCriteria: `Scenario: Create defect automatically
Given I am a QA Agent validating implementation
And I detect a requirement not being met
When I create a defect
Then the defect should have appropriate severity (critical, high, medium, low)
And the defect should have correct type (bug, regression, performance, security, usability)
And the defect should be linked to the user story
And the defect should reference the specific acceptance criteria that failed

Scenario: Provide detailed reproduction steps
Given I am creating a defect
When I document the issue
Then I should provide step-by-step reproduction instructions
And I should include actual vs expected results
And I should capture relevant environment details

Scenario: Block story completion for open defects
Given a user story has open defects
When someone attempts to mark the story as done
Then the system should block the status change
And the system should display defect count and severity
And the story should remain blocked until defects are resolved`
  },
  {
    id: 'US-AI-AGENT-007',
    acceptanceCriteria: `Scenario: Validate Gherkin acceptance criteria format
Given I am a QA Agent enforcing quality gates
And a user story is submitted for review
When I validate acceptance criteria
Then I should verify proper Gherkin format (Given/When/Then)
And I should ensure each scenario is testable
And I should flag any ambiguous or unclear criteria

Scenario: Check test coverage thresholds
Given code is submitted for review
When I check test coverage
Then unit test coverage should meet minimum threshold (e.g., 80%)
And integration tests should cover critical paths
And I should report coverage gaps

Scenario: Block transitions for failing quality gates
Given quality gates have failed
When someone attempts to move story to "done"
Then the transition should be blocked
And the system should list all failing quality gates
And the system should provide quality metrics report`
  },
  {
    id: 'US-AI-AGENT-008',
    acceptanceCriteria: `Scenario: Assign tasks to appropriate agents
Given a user story enters the development workflow
When the system determines next action needed
Then the appropriate agent should be assigned automatically
And the agent should receive task context and requirements
And the assignment should be logged

Scenario: Manage agent-to-agent handoffs
Given one agent completes its task
When the next agent needs to take over
Then the handoff should occur automatically
And all context should transfer to the next agent
And the handoff should be tracked in the workflow

Scenario: Handle agent dependencies and waiting states
Given an agent is waiting for another agent
When the dependency is not yet complete
Then the waiting agent should enter "waiting" state
And the system should track the dependency
And the waiting agent should resume automatically when dependency completes

Scenario: Handle agent failures gracefully
Given an agent encounters an error
When the agent cannot complete its task
Then the system should retry the operation
And if retry fails, escalate to human intervention
And the failure should be logged with details`
  },
  {
    id: 'US-AI-AGENT-009',
    acceptanceCriteria: `Scenario: Log all agent actions
Given an agent performs any action
When the action is executed
Then the system should log the action with timestamp
And the log should include agent type and task context
And the log should capture agent decisions and reasoning

Scenario: Track agent performance metrics
Given agents are working on tasks
When tasks are completed
Then the system should track time per task
And the system should measure task success rate
And the system should calculate agent productivity metrics

Scenario: Provide searchable audit trail
Given I need to review agent activities
When I search the audit trail
Then I should be able to filter by agent type
And I should be able to filter by time range
And I should be able to filter by story or task
And I should see complete activity timeline with details`
  },
  {
    id: 'US-AI-AGENT-010',
    acceptanceCriteria: `Scenario: Invoke specific agent from story view
Given I am viewing a user story
When I need AI agent assistance
Then I should see options to invoke Product Owner, QA, Developer, or Architect agents
And I should be able to select the agent type
And I should be able to provide context and instructions

Scenario: View agent responses in real-time
Given I have invoked an agent
When the agent is working
Then I should see agent status (thinking, analyzing, implementing)
And I should see real-time progress updates
And I should receive the agent's response when complete

Scenario: Accept or modify agent suggestions
Given an agent provides recommendations
When I review the suggestions
Then I should be able to accept the suggestions
And I should be able to modify or reject suggestions
And I should be able to provide feedback to the agent`
  },
  {
    id: 'US-AI-AGENT-011',
    acceptanceCriteria: `Scenario: View all active agents
Given I am viewing the agent collaboration dashboard
When agents are actively working
Then I should see all active agents and their current tasks
And I should see agent status for each (idle, working, waiting)
And I should see which stories each agent is working on

Scenario: Monitor agent-to-agent handoffs
Given agents are collaborating on stories
When an agent-to-agent handoff occurs
Then I should see the handoff in the dashboard
And I should see dependencies between agents
And I should see waiting states and blockers

Scenario: Filter and track agent performance
Given I want to analyze agent performance
When I use dashboard filters
Then I should be able to filter by agent type
And I should be able to filter by epic or time period
And I should see agent performance metrics and trends`
  },
  {
    id: 'US-AI-AGENT-012',
    acceptanceCriteria: `Scenario: Review Product Owner implementations
Given a Product Owner Agent has refined a story
When I review as the Architect Agent
Then I should validate story technical feasibility
And I should suggest technical considerations
And I should flag potential architecture impacts

Scenario: Validate QA test strategies
Given a QA Agent has created test cases
When I review test strategy
Then I should assess test coverage completeness
And I should suggest additional technical test scenarios
And I should validate performance and security test cases

Scenario: Participate in agent discussions
Given multiple agents are collaborating
When technical decisions are needed
Then I should provide architectural guidance
And I should suggest design patterns and best practices
And I should escalate complex decisions when needed`
  }
];

async function fixAllGherkin() {
  console.log('🔧 Fixing ALL agent story Gherkin acceptance criteria...\n');

  for (const update of gherkinUpdates) {
    await db.update(schema.userStories)
      .set({ acceptanceCriteria: update.acceptanceCriteria })
      .where(eq(schema.userStories.id, update.id));
    
    console.log(`✅ Updated ${update.id} with discrete Gherkin scenarios`);
  }

  console.log('\n✨ All agent stories now have proper Gherkin format!');
  console.log('\n📊 Summary:');
  console.log('- Updated 9 stories with discrete Given/When/Then scenarios');
  console.log('- Previously fixed: US-AI-AGENT-002, US-AI-AGENT-004');
  console.log('- New stories: US-AI-AGENT-013, US-AI-AGENT-014, US-AI-AGENT-015');
  console.log('- Total: 14 stories, all with testable Gherkin acceptance criteria ✅');
}

fixAllGherkin().catch(console.error);
