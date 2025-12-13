import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../shared/schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

const agentStories = [
  {
    id: 'US-AI-AGENT-001',
    title: 'Agent System Architecture and Schema',
    description: 'As a platform architect, I want to define the core agent system architecture so that multiple AI agents can collaborate on development tasks with clearly defined roles, capabilities, and permissions.',
    acceptanceCriteria: `Given I am designing the agent system
When I define the agent schema and capabilities
Then the system should support:
- Agent types: Product Owner, QA, Architect
- Agent capabilities and permissions per role
- Agent state tracking and activity logs
- Agent-to-agent communication protocols
- Audit trail for all agent actions`,
    epicId: 'EPIC-5',
    status: 'backlog',
    priority: 'high',
    storyPoints: 8,
    labels: ['ai-agents', 'architecture', 'core-system']
  },
  {
    id: 'US-AI-AGENT-002',
    title: 'Product Owner Agent - Story Definition',
    description: 'As a Product Owner Agent, I want to create and refine user stories with acceptance criteria so that business requirements are properly captured and ready for development.',
    acceptanceCriteria: `Given I am a Product Owner Agent
When I receive business requirements
Then I should be able to:
- Create user stories with proper INVEST criteria
- Generate Gherkin acceptance criteria automatically
- Refine existing stories based on feedback
- Validate story completeness and clarity
- Link stories to business goals and epics`,
    epicId: 'EPIC-5',
    status: 'backlog',
    priority: 'high',
    storyPoints: 13,
    labels: ['ai-agents', 'product-owner', 'story-management']
  },
  {
    id: 'US-AI-AGENT-003',
    title: 'Product Owner Agent - Feature Development',
    description: 'As a Product Owner Agent, I want to develop features and implement requirements so that I can drive the business strategy and deliver value to users.',
    acceptanceCriteria: `Given I am a Product Owner Agent with development capabilities
When I receive approved user stories
Then I should be able to:
- Implement features following acceptance criteria
- Write code that meets business requirements
- Validate implementation against user stories
- Update story status based on completion
- Document implementation decisions`,
    epicId: 'EPIC-5',
    status: 'backlog',
    priority: 'high',
    storyPoints: 13,
    labels: ['ai-agents', 'product-owner', 'development']
  },
  {
    id: 'US-AI-AGENT-004',
    title: 'Product Owner Agent - UAT Checkout Workflow',
    description: 'As a Product Owner Agent, I want to perform UAT (User Acceptance Testing) checkout with the user so that features are validated before business release.',
    acceptanceCriteria: `Given I am a Product Owner Agent performing UAT
When a feature is marked for UAT checkout
Then I should be able to:
- Execute UAT test scenarios based on acceptance criteria
- Collaborate with the user to validate functionality
- Document UAT results and findings
- Accept or reject feature completion
- Create defects if requirements are not met
- Mark stories as "UAT Passed" or "UAT Failed"`,
    epicId: 'EPIC-5',
    status: 'backlog',
    priority: 'high',
    storyPoints: 8,
    labels: ['ai-agents', 'product-owner', 'uat', 'quality-assurance']
  },
  {
    id: 'US-AI-AGENT-005',
    title: 'QA Agent - Test Case Generation',
    description: 'As a QA Agent, I want to automatically generate test cases from acceptance criteria so that comprehensive test coverage is ensured for all user stories.',
    acceptanceCriteria: `Given I am a QA Agent analyzing user stories
When I receive stories with Gherkin acceptance criteria
Then I should be able to:
- Parse Given/When/Then scenarios automatically
- Generate test cases for each scenario
- Identify edge cases and negative test scenarios
- Create test data requirements
- Suggest additional test scenarios based on patterns`,
    epicId: 'EPIC-5',
    status: 'backlog',
    priority: 'high',
    storyPoints: 13,
    labels: ['ai-agents', 'qa', 'test-automation', 'gherkin']
  },
  {
    id: 'US-AI-AGENT-006',
    title: 'QA Agent - Defect Management',
    description: 'As a QA Agent, I want to create defects when requirements are not met so that quality issues are tracked and resolved before release.',
    acceptanceCriteria: `Given I am a QA Agent validating implementation
When I detect requirements not being met
Then I should be able to:
- Automatically create defects with severity and type
- Link defects to specific acceptance criteria
- Provide detailed reproduction steps
- Suggest potential root causes
- Block story completion until defects are resolved
- Validate defect resolution`,
    epicId: 'EPIC-5',
    status: 'backlog',
    priority: 'high',
    storyPoints: 8,
    labels: ['ai-agents', 'qa', 'defect-management', 'quality-gates']
  },
  {
    id: 'US-AI-AGENT-007',
    title: 'QA Agent - Quality Gates and Validation',
    description: 'As a QA Agent, I want to enforce quality gates at each development stage so that code meets quality standards before progressing.',
    acceptanceCriteria: `Given I am a QA Agent enforcing quality gates
When code is submitted for review
Then I should be able to:
- Validate Gherkin acceptance criteria are testable
- Check test coverage meets minimum thresholds
- Verify all critical paths have test cases
- Validate security and performance requirements
- Block transitions to "done" if quality gates fail
- Provide quality metrics and reports`,
    epicId: 'EPIC-5',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 8,
    labels: ['ai-agents', 'qa', 'quality-gates', 'validation']
  },
  {
    id: 'US-AI-AGENT-008',
    title: 'Agent Orchestration Workflow Engine',
    description: 'As a platform user, I want AI agents to collaborate seamlessly so that development tasks flow efficiently through the lifecycle with agent-to-agent handoffs.',
    acceptanceCriteria: `Given I have multiple AI agents working on a project
When a story moves through the development lifecycle
Then the system should:
- Automatically assign tasks to appropriate agents
- Enable agent-to-agent communication and handoffs
- Track agent dependencies and waiting states
- Manage parallel vs sequential agent work
- Provide visibility into agent workflow status
- Handle agent failures and retries gracefully`,
    epicId: 'EPIC-5',
    status: 'backlog',
    priority: 'high',
    storyPoints: 13,
    labels: ['ai-agents', 'orchestration', 'workflow', 'automation']
  },
  {
    id: 'US-AI-AGENT-009',
    title: 'Agent Activity Tracking and Audit Trail',
    description: 'As a platform administrator, I want to track all agent activities so that I can audit agent actions, measure productivity, and ensure accountability.',
    acceptanceCriteria: `Given I am tracking agent activities
When agents perform any action in the system
Then the system should:
- Log all agent actions with timestamps
- Capture agent decisions and reasoning
- Track agent performance metrics
- Store agent communication logs
- Provide audit trail for compliance
- Enable filtering and searching agent activities
- Display agent activity timeline per story`,
    epicId: 'EPIC-5',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 5,
    labels: ['ai-agents', 'audit', 'tracking', 'compliance']
  },
  {
    id: 'US-AI-AGENT-010',
    title: 'Agent Invocation UI and Interface',
    description: 'As a platform user, I want to easily invoke and interact with AI agents so that I can leverage their capabilities through an intuitive interface.',
    acceptanceCriteria: `Given I am working on user stories in ARKHITEKTON
When I need AI agent assistance
Then I should be able to:
- Invoke specific agents (Product Owner, QA, Architect) from story view
- Provide context and instructions to agents
- View agent responses and recommendations in real-time
- Accept or modify agent suggestions
- See agent status (thinking, analyzing, implementing)
- Review agent work before accepting
- Configure agent preferences and settings`,
    epicId: 'EPIC-5',
    status: 'backlog',
    priority: 'high',
    storyPoints: 8,
    labels: ['ai-agents', 'ui', 'user-experience', 'interface']
  },
  {
    id: 'US-AI-AGENT-011',
    title: 'Multi-Agent Collaboration Dashboard',
    description: 'As a platform user, I want to see all agent activities in a unified dashboard so that I understand what agents are working on and their progress.',
    acceptanceCriteria: `Given I am viewing the agent collaboration dashboard
When agents are actively working on stories
Then I should be able to:
- See all active agents and their current tasks
- View agent-to-agent handoffs and dependencies
- Monitor agent performance metrics
- Track story progress through agent workflow
- Filter by agent type, epic, or time period
- Receive notifications for agent completions
- Review agent recommendations and decisions`,
    epicId: 'EPIC-5',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 5,
    labels: ['ai-agents', 'dashboard', 'visibility', 'monitoring']
  },
  {
    id: 'US-AI-AGENT-012',
    title: 'Architect Agent Enhancement - Multi-Agent Support',
    description: 'As an Architect Agent, I want to collaborate with Product Owner and QA agents so that I can provide comprehensive technical guidance within the agent ecosystem.',
    acceptanceCriteria: `Given I am an Architect Agent in the multi-agent system
When collaborating with other agents
Then I should be able to:
- Review Product Owner Agent implementations
- Validate QA Agent test strategies
- Provide technical recommendations to both agents
- Flag architectural concerns early in the workflow
- Suggest design patterns and best practices
- Participate in agent-to-agent discussions
- Escalate complex technical decisions`,
    epicId: 'EPIC-5',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 5,
    labels: ['ai-agents', 'architect', 'collaboration', 'enhancement']
  }
];

async function createAgentStories() {
  console.log('🤖 Creating Multi-Agent AI System user stories...\n');

  for (const story of agentStories) {
    try {
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
      
      console.log(`✅ Created story: ${story.id} - ${story.title}`);
    } catch (error: any) {
      console.log(`⚠️  Skipping ${story.id}: ${error.message}`);
    }
  }

  console.log('\n✨ Multi-Agent AI System stories created successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Total stories: ${agentStories.length}`);
  console.log(`- Epic: EPIC-5 (Operations & Intelligence)`);
  console.log(`- Total story points: ${agentStories.reduce((sum, s) => sum + s.storyPoints, 0)}`);
  console.log('\n🎯 Next Steps:');
  console.log('1. Review stories in the Plan view');
  console.log('2. Prioritize and estimate');
  console.log('3. Begin implementation with agent system architecture');
}

createAgentStories().catch(console.error);
