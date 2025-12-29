/**
 * Seed Test Planning User Stories (US-QC-101 through US-QC-104)
 * These stories are ALREADY IMPLEMENTED but not yet seeded in the database
 */

import { db } from '../server/db';
import { epics, userStories } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function seedTestPlanningStories() {
  console.log('Seeding Test Planning and Execution User Stories\n');

  // Check if epic exists, create if not
  let testPlanningEpic = await db
    .select()
    .from(epics)
    .where(eq(epics.id, 'EPIC-QC-001'))
    .limit(1);

  if (testPlanningEpic.length === 0) {
    console.log('Creating EPIC-QC-001: Test Planning and Execution');
    await db.insert(epics).values({
      id: 'EPIC-QC-001',
      name: 'Quality Center: Test Planning and Execution',
      description: 'Comprehensive test management system with hierarchical test suites, detailed test cases, test run execution, and coverage tracking.',
      status: 'done',
      priority: 'high',
      estimatedPoints: 26,
      createdAt: new Date(),
    });
    console.log('EPIC-QC-001 created\n');
  } else {
    console.log('EPIC-QC-001 already exists\n');
  }

  // Define user stories
  const stories = [
    {
      id: 'US-QC-101',
      title: 'Test Suite Management',
      epicId: 'EPIC-QC-001',
      description: `As a QA Engineer I want to organize test cases into hierarchical test suites so that I can logically group tests by module feature or testing phase.

Acceptance Criteria:
- Can create test suite with name description module
- Supports nested sub-suites with parent_suite_id
- Tree view displays all suites with metrics
- Suite metrics show total cases pass fail stats
- Delete cascade removes child suites and cases

Implementation: Test Suite Tree, Test Suite Dialog, API endpoints complete`,
      priority: 'high',
      estimatedPoints: 8,
      status: 'done',
      type: 'feature',
      acceptanceCriteria: 'Given I am on Test Plan page when I create test suite then I can specify name description module parent suite. Given I have suites when I view Test Plan then I see tree view with metrics.',
      createdAt: new Date('2025-11-01'),
    },
    {
      id: 'US-QC-102',
      title: 'Test Case Definition',
      epicId: 'EPIC-QC-001',
      description: `As a QA Engineer I want to define detailed test cases with steps and expected results so that I can provide clear testing instructions and ensure consistency.

Acceptance Criteria:
- Can create test case with title preconditions steps priority type
- Dynamic step builder allows add remove reorder steps
- Can link test cases to user stories for traceability
- Test case list view with filters by suite priority type
- Full CRUD operations functional

Implementation: Test Case Dialog with step builder Test Case List API endpoints complete`,
      priority: 'high',
      estimatedPoints: 5,
      status: 'done',
      type: 'feature',
      acceptanceCriteria: 'Given I have test suite when I create test case then I can add steps set priority type link to stories. Given I have test steps when I view test case then I see numbered steps with expected results.',
      createdAt: new Date('2025-11-02'),
    },
    {
      id: 'US-QC-103',
      title: 'Test Run Execution',
      epicId: 'EPIC-QC-001',
      description: `As a QA Engineer I want to execute test runs and record results systematically so that I can track testing progress and identify failures.

Acceptance Criteria:
- Can create test run with name assignee environment
- Auto-populate test results for all cases in suite
- Can mark results as Passed Failed Blocked Skipped
- Auto-create defect from failed test with pre-filled details
- Mark run as complete with completion timestamp
- Run cannot be edited after completion

Implementation: Test Run Dialog Test Execution interface Test Run List API endpoints complete`,
      priority: 'critical',
      estimatedPoints: 8,
      status: 'done',
      type: 'feature',
      acceptanceCriteria: 'Given I have test cases when I create test run then I can assign select environment execute tests. Given I am executing test run when I run each test then I can mark pass fail blocked skipped auto-create defects from failures.',
      createdAt: new Date('2025-11-03'),
    },
    {
      id: 'US-QC-104',
      title: 'Test Coverage Dashboard',
      epicId: 'EPIC-QC-001',
      description: `As a Product Owner or QA Manager I want to view test coverage metrics across user stories so that I can identify gaps and ensure adequate testing before release.

Acceptance Criteria:
- Overall coverage percentage displayed stories with tests vs total stories
- Story coverage breakdown shows covered and uncovered counts
- Coverage by module breakdown Plan Wiki Design etc
- High-risk stories list shows critical high priority stories without tests
- Export coverage report to CSV for stakeholder reporting

Implementation: Test Coverage Dashboard API endpoint with joins CSV export complete`,
      priority: 'high',
      estimatedPoints: 5,
      status: 'done',
      type: 'feature',
      acceptanceCriteria: 'Given I am on Quality Reports page when I view Test Coverage Dashboard then I see overall coverage percentage story breakdown coverage by module high-risk uncovered stories. Given I see uncovered stories when I click story then I navigate to story detail page.',
      createdAt: new Date('2025-11-04'),
    },
  ];

  // Insert stories
  for (const story of stories) {
    const existing = await db
      .select()
      .from(userStories)
      .where(eq(userStories.id, story.id))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(userStories).values(story);
      console.log(`Created ${story.id}: ${story.title}`);
    } else {
      console.log(`${story.id} already exists skipping`);
    }
  }

  console.log('\nTest Planning and Execution user stories seeded successfully');
  console.log('Summary:');
  console.log('- EPIC-QC-001: Test Planning and Execution');
  console.log('- US-QC-101: Test Suite Management (8 pts) DONE');
  console.log('- US-QC-102: Test Case Definition (5 pts) DONE');
  console.log('- US-QC-103: Test Run Execution (8 pts) DONE');
  console.log('- US-QC-104: Test Coverage Dashboard (5 pts) DONE');
  console.log('\nTotal: 26 story points COMPLETE IMPLEMENTATION');
}

seedTestPlanningStories()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error seeding test planning stories:', error);
    process.exit(1);
  });
