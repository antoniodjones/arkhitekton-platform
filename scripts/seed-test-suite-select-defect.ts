import { db } from '../server/db';
import { defects, epics, userStories } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function seedTestSuiteSelectDefect() {
  console.log('🐛 Seeding Test Suite Dialog Select Defect...\n');

  // Ensure parent epic exists
  const epicId = 'EPIC-QC-001';
  let epic = await db.query.epics.findFirst({ where: eq(epics.id, epicId) });
  if (!epic) {
    console.log(`Creating epic: ${epicId}...`);
    await db.insert(epics).values({
      id: epicId,
      name: 'Quality Center: Defect Management',
      description: 'Full-featured defect tracking and quality management system for tracking bugs, regressions, and quality issues across all modules.',
      valueStream: 'Quality & Testing',
      status: 'in-progress',
      priority: 'high',
      createdAt: new Date('2025-12-24T11:00:00Z'),
      updatedAt: new Date('2025-12-24T12:30:00Z'),
    });
    console.log(`✅ Created epic: ${epicId}\n`);
  } else {
    console.log(`ℹ️  Epic already exists: ${epicId}\n`);
  }

  // Create new user story for Test Planning & Execution
  const userStoryId = 'US-QC-002';
  let userStory = await db.query.userStories.findFirst({ where: eq(userStories.id, userStoryId) });
  if (!userStory) {
    console.log(`Creating user story: ${userStoryId}...`);
    await db.insert(userStories).values({
      id: userStoryId,
      epicId: epicId,
      title: 'Test Suite Management and Organization',
      description: `As a quality engineer, I need to create and manage test suites organized by module, so that I can structure my test cases logically and run organized test campaigns.`,
      acceptanceCriteria: `Given I am in the Test Plan module
When I create a new test suite
Then I should be able to provide a name, description, and assign it to a specific module (Plan, Wiki, Quality Center, Design Studio, Canvas, Agent)
And I should be able to select "None" if the test suite is not specific to any module
And the test suite should be created successfully
And I should be able to edit the test suite later
And all form validations should work correctly.`,
      storyPoints: 5,
      status: 'done',
      priority: 'high',
      createdAt: new Date('2025-12-24T11:00:00Z'),
      updatedAt: new Date('2025-12-24T12:30:00Z'),
    });
    console.log(`✅ Created user story: ${userStoryId}\n`);
  } else {
    console.log(`ℹ️  User story already exists: ${userStoryId}\n`);
  }

  // Check if defect already exists
  const defectId = 'DEF-QC-004';
  const existing = await db.query.defects.findFirst({ where: eq(defects.id, defectId) });
  
  if (!existing) {
    console.log(`Creating defect: ${defectId}...`);
    await db.insert(defects).values({
      id: defectId,
      userStoryId: userStoryId,
      title: 'CRITICAL: Test Suite Dialog Select component uses empty string value',
      description: `**Location**: client/src/components/quality/test-suite-dialog.tsx (line 151)

**Issue**: The Module selector in the Test Suite Dialog has a SelectItem with \`value=""\` (empty string) for the "None" option. Radix UI Select component explicitly forbids empty string values because they are reserved for clearing the selection and showing the placeholder. This causes a runtime error that prevents the Test Plan page from loading.

**Error Message**:
\`\`\`
[plugin:runtime-error-plugin] A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.
\`\`\`

**Steps to Reproduce**:
1. Navigate to Quality Center → Test Plan
2. Observe the runtime error overlay
3. Application fails to render the page

**Expected Behavior**: The Test Suite Dialog should render without errors, and users should be able to select "None" as a valid module option.

**Actual Behavior**: Runtime error prevents the entire Test Plan page from loading, making the feature completely unusable.

**Impact**: Critical - The entire Test Plan module is broken and inaccessible to all users.`,
      severity: 'critical' as const,
      type: 'bug' as const,
      status: 'resolved' as const,
      rootCause: `Radix UI Select component constraint violation. The component reserves empty string values for internal use (clearing selection / showing placeholder). Using \`value=""\` on a SelectItem breaks this contract and causes a runtime error.

This is a common mistake when developers want to represent "no selection" or "none" as an empty string in form state. The correct approach is to use a sentinel value like \`"none"\` or \`null\` (if the Select supports it).`,
      resolution: `Changed the SelectItem value from empty string to "none":
\`\`\`tsx
// Before:
<SelectItem value="">None</SelectItem>

// After:  
<SelectItem value="none">None</SelectItem>
\`\`\`

This allows the Select component to function correctly while still providing a "None" option for users. The value "none" can be treated as a special case in business logic if needed (e.g., filtering, saving to database).

No additional changes were needed because no code was explicitly checking for empty string module values.

Fixed in commit [to be linked].`,
      discoveredBy: 'User Testing',
      assignedTo: 'Platform Team',
      createdAt: new Date('2025-12-24T12:30:00Z'),
      updatedAt: new Date('2025-12-24T12:30:00Z'),
      resolvedAt: new Date('2025-12-24T12:30:00Z'),
    });
    console.log(`✅ Created defect: ${defectId}`);
  } else {
    console.log(`ℹ️  Defect already exists: ${defectId}`);
  }

  console.log('\n✅ Test Suite Select defect seeded successfully!');
}

seedTestSuiteSelectDefect()
  .then(() => {
    console.log('\n🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });

